---
title: '[SQL AntiPattern] 3부 쿼리 안티패턴'
tags: [book, sql anti pattern, database, sql]
categories: book
---

SQL 을 효과적으로 활용하기 위해 SQL AntiPattern 의 내용을 정리한다.  
3부에서는 DML(Data Manipulation Language)에 대해 다룬다.  

<!--more-->

<br/>

## 14장 모르는 것에 대한 두려움: 누락된 값 구분하기

`NULL` 을 포함하는 컬럼에 대해 쿼리를 작성해야 한다.  
아래는 쿼리에서 `NULL` 값을 생산적으로 사용하는 방법이다.

- 행을 생성할 때 값을 알수 없는 곳에 `NULL` 사용
- 적용 가능한 값이 없는 경우 `NULL` 사용
- 유효하지 않은 값이 입력되는 경우 `NULL` 사용
- 외부 조인에서 매치되지 않는 행의 컬럼 값을 채우는 경우 `NULL` 사용

### 안티패턴: NULL 을 일반 값처럼 사용

SQL 에서 `NULL` 을 `0`, `false`, 빈문자열과 다른 특별한 값으로 취급한다.  
`NULL` 값은 특별한 규칙을 따른다.

- **수식에서 NULL 사용**
  - `NULL` 에 숫자를 더해도 알지 못하는 값이기 때문에 결과는 `NULL`
    - ex) `SELECT NULL + 1 -> NULL`
  - `AND`, `OR`, `NOT` 같은 불리언 수식 결과는 `NULL`
- **NULL 을 가질 수 있는 컬럼 검색**
  - 여집합(`NOT`)으로 검색해도 값이 `NULL` 인 행은 검색되지 않음
  - 동등 조건으로 검색해도 값이 `NULL` 인 행은 검색되지 않음
    - ex) `WHERE column = NULL`, `WHERE column <> NULL` 조건은 모두 `NULL` 인 행을 반환하지 않음
- **쿼리 파라미터로 NULL 사용**
  - `NULL` 을 일반적인 값처럼 사용하기 어려워 파라미터로 사용 불가
    - ex) `WHERE column = ?`
- **문제 회피하기**
  - `NULL` 을 금지하기 위해 다른 값(ex. `-1`, `''`...)으로 대체하면 문제가 될 수 있음
    - 해당되는 값이 어떤 컬럼에서는 중요한 값이 될 수 있음
    - FK 설정이 어려워짐 (없는 값에 대한 행추가가 필요)
    - 해당 값에 대한 의미를 기억하거나 문서화 필요
  - 누락된 값은 `NULL` 로 표현하는 것이 좋음

#### 사용이 합당한 경우

- 외부 데이터를 불러오거나(import) 내보내기(export) 하는 경우
- 누락된 값에 대해 특별한 구분이 있는 경우

### 해법: 유일한 값으로 NULL을 사용하라

- **스칼라 수식에서의 NULL**  
  - 다음 모든 수식의 결과는 `NULL`
    - `NULL + 1`
    - `NULL = 1`
    - `NULL <> 1`
    - `NULL || 'string'`
    - `NULL = NULL` (모르는 값과 모르는 값은 같은지 알 수 없음)
    - `NULL <> NULL` (모르는 값과 모르는 값은 다른지 알 수 없음)
- **불리언 수식에서의 NULL**
  - `NULL AND TRUE` -> `NULL`
  - `NULL AND FALSE` -> `FALSE` (어떤 값이든 FALSE와 AND 연산하면 FALSE)
  - `NULL OR TRUE` -> `TRUE` (어떤 값이든 TRUE와 OR 연산하면 TRUE)
  - `NULL OR FALSE` -> `NULL`
  - `NOT NULL` -> `NULL`
- **NULL 검색하기**
  - `NULL` 을 검색하기 위해서는 다른 연산 필요
    - `IS NULL`, `IS NOT NULL`
    - `IS DISTINCT FROM` 을 사용하면 `IS NULL` 확인 조건이 포함됨
      - MySQL 에서는 `IS DISTINCT FROM` 대신 `<=>` 지원
- **칼럼을 NOT NULL 로 선언하기**
  - `NULL` 값이 정책 위반 또는 의미가 없는 경우 `NOT NULL` 선언 권장
- **동적 디폴트**
  - `COALESCE` 을 통해 특정 쿼리에서만 디폴트 값 설정