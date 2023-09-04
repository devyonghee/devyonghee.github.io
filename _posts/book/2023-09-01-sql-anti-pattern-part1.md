---
title: '[SQL AntiPattern] 1부 논리적 데이터베이스 설계 안티패턴'
tags: [book, sql anti pattern, database, sql]
categories: book
---

SQL 을 효과적으로 활용하기 위해 SQL AntiPattern 의 내용을 정독하고 정리한다.  
1부에서는 데이터베이스 테이블과 컬럼, 관계를 계획하는 방법에 대해 알아본다.  

<!--more-->

<br/>

## 2장 무단횡단 (다중 값 속성 저장)

다대다 관계를 위해 교차 테이블 생성을 피하기 위해 쉼표(`,`)로 구분된 목록을 사용한다.  
이러한 안티패턴을 책에서는 '무단횡단' 또는 '교차로' 로 표현했다.

### 안티패턴

`product` 테이블의 `account_id` 컬럼을 `VARCHAR` 로 선언하고 쉼표로 구분해 나열하는 방법
(ex. '12,34')

- 특정 계정에 대한 상품을 찾기 위해서는 패턴 매칭 필요
  - ex) `REGEXP`, `LIKE`...
- 계정을 조회하기 위해서는 어려운 조인, 많은 비용 발생 
  - 인덱스 활용 불가
  - 두 테이블의 카테시안 곱 생성하여 평가
- 제품 별 계정 정보를 집계하기 위해서는 `COUNT`, `SUM` 같은 집계 쿼리 사용 불가
  - `,` 의 개수를 세는 등 특별한 방법 필요
- 제품에 대한 계정 변경이 어려움
  - `concat`, `replace` 등의 함수를 사용해야 함 (정렬은 불가능)
  - 특정 처리를 위해 많은 코드 필요
- 유효하지 않은 계정에 대한 검증이 어려움
- 문자열인 경우 구분자 문자를 포함하는 경우 처리가 모호함
- 목록 길이 제한을 정하는 것이 모호함 (각 항목의 길이가 다르면 들어갈 수 있는 항목의 개수가 달라짐)

#### 사용이 합당한 경우

- 반정규화를 적용하여 성능을 향상하기 위함
  - 정규화가 우선되어야 하므로 보수적으로 결정 필요
- 목록 안의 개별 값을 분리할 필요가 없는 경우

### 해결책

{% include image.html alt="contact mapping erd" source_txt='SQL AntiPattern' path="images/book/sql-anti-pattern/contact-mapping-erd.png" %}

`account_id` 를 `product` 테이블이 아닌 별도의 테이블에 저장  
이렇듯 어떤 테이블이 FK 로 두 테이블을 참조할 때 교차 테이블(조인 테이블, 다대다 테이블, 매핑 테이블) 이라고 함

- `product` 와 `contact` 테이블을 통해 `account` 쉽게 조회 가능
- 제품과 계정에 대한 복잡한 집계 쿼리 가능
- 특정 제품에 대한 계정 변경 쉬움
- FK 를 사용하여 유효한 계정 검증 가능, 참조 정합성 유지
- 구분자 필요하지 않음, 항목 수 제한 없음
- 인덱스를 활용하여 성능 향상
- 각 항목에 속성 추가 가능

## 3장 순진한 트리 (계층구조 저장 및 조회)

답글을 달 수 있고 답글에 대한 답글을 달 수 있다고 가정  
데이터가 재귀적 관계를 가지고 트리나 계층 구조를 가질 수 있음  
각 항목은 노드라고 부르고 최상위 노드는 뿌리(root) 가장 아래 노드는(leaf)라고 부름   

### 안티패턴: 항상 부모에 의존

{% include image.html alt="adjacency list comment table" source_txt='SQL AntiPattern' path="images/book/sql-anti-pattern/adjust-list-comment-table.png" %}
{% include image.html alt="adjacency list comment erd" source_txt='SQL AntiPattern' path="images/book/sql-anti-pattern/adjust-list-comment-erd.png" %}
{% include image.html alt="adjacency comment tree sample" source_txt='SQL AntiPattern' path="images/book/sql-anti-pattern/adjacency-comment-tree-sample.png" %}

이처럼 같은 테이블 안의 다른 글을 참조하는 설계를 인접 목록(adjacency list) 라고 한다. 


- 단계가 깊어질 수록 컬럼을 추가하는 방식으로 후손을 포함하게 됨
  - 계속 본인 테이블의 JOIN 문을 추가해야 함
  - `COUNT` 같은 집계 수치를 계산하기 어려워짐
  - 다른 방법으로 관련 데이터를 모두 조회하여 애플리케이션에서 트리구조를 만들어줄 수 있음
- 노드를 삭제하기 위해서는 자손을 찾아 가장 아래 단계부터 차례로 삭제 필요
  - `ON DELETE CASCADE` 로 자동화 가능함
  - 트리에서 고아 노드 관리가 필요함

#### 사용이 합당한 경우

- 계층적 데이터 작업이 많지 않은 경우
  - 주어진 노드의 부모나 자식을 바로 얻을 수 있음
  - 새로운 노드 추가가 쉬움

### 해결책

- 인적 목록 모델 이외에 다른 모델 사용 (처음에는 복잡해보일 수 있음)
  - 경로 열거(Path Enumeration)
  - 중첩 집합(Nested Sets)
  - 클로저 테이블(Closure Table)