---
title: '[마이크로서비스] Saga Pattern 자세히 알아보기 (feat. orchestration, choreography)' 
tags: [msa, orchestration, choreography]
categories: theory
---

마이크로서비스는 하나의 거대한 서비스를 소규모 독립적인 서비스로 나눠서 기능을 제공하는 아키텍처이다.  
이 아키텍처를 이용하면 확장이 용이하고 개발 속도를 향상시킬 수 있다.  

<!--more-->

<br/>

하지만 마이크로서비스 환경에서 트랜잭션이 여러 서비스에 걸쳐있기 때문에 일관성을 지키는 것은 쉽지 않다.  
그래서 여러 서비스에서 트랜잭션을 구현할 수 있는 과정이 필요하다.  

## Saga Pattern 

이전에는 분산 트랜잭션을 관리하기 위해 2PC(two-phaze commit) 프로토콜을 이용했다.  
모든 참가자가 커밋하거나 롤백할지에 대해 관여했기 때문에 트랜잭션 관리가 가능했다. 
하지만 같은 DB 여야 하고, DB가 분산 트랜잭션을 지원해야 한다. (ex. NoSQL 은 지원하지 않음) 

{% include image.html alt="saga" source_txt='microsoft' source='https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga' path="images/theory/saga-pattern/saga.png" %}

Saga Pattern 은 분산 트랜잭션 환경에서 메시지 또는 이벤트를 주고 받으며 서비스 간의 데이터 일관성을 지키기 위한 패턴이다.  
이 패턴은 로컬 트랜잭션을 사용하며, 트랜잭션이 실패되면 변경된 내용을 취소하는 보상 트랜잭션을 실행한다.  

Saga Pattern 을 구현하는 방법에는 보통 오케스트레이션(orchestration)과 코레오그래피(choreography) 두 가지 방법이 존재한다.   

<br/>

## 오케스트레이션(orchestration)

오케스트레이션(orchestration)은 오케스트레이터(orchestrator) 라는 중앙 컨트롤러가 보상 작업을 트리거하는 방식이다.  
이 오케스트레이터는 모든 트랜잭션을 처리하고 수행해야 하는 작업을 메세지를 보내 참여자들과 통신한다.
오케스트레이터는 작업의 상태를 저장 및 해석하고 있어서 분산 트랜잭션의 중앙 집중화가 이루어지고 데이터 일관성을 지킬 수 있다.  

- 서비스의 Saga 모듈이 존재
- 마이크로 서비스들의 로컬 트랜잭션이 오케스트레이터에 의해 호출, 상태값 설정
- 참여자들의 트랜잭션이 모두 처리되면 서비스의 상태 변경
- 특정 서비스에서 오류가 발생되면 보상 트랜잭션 호출

### 주문 생성 애플리케이션 예제

{% include image.html alt="orchestration" source_txt='microservices' source='https://microservices.io/patterns/data/saga.html' path="images/theory/saga-pattern/orchestration.png" %}

1. `Order Service` 에서 `POST /orders` 수신 및 오케스트레이터에 주문 생성 알림
2. `PENDING` 상태의 주문 생성
3. `Customer Service`에 `Reserve Credit` 명령 요청
4. `Reserve Credit` 수행
5. 응답 메세지 수신
6. 오케스트레이터가 주문 생성을 승인하거나 거부

### 장점

- 참여자가 많거나 추가되는 상황 같이 복잡한 워크플로에 적합
- 활동 흐름의 제어 가능
- 오케스트레이터가 존재하여 순환 종속성이 발생되지 않음
- 각 참여자는 다른 참여자의 명령어를 알지 않아도 됨

### 단점

- 중앙에서 관리를 위한 복잡한 로직 구현 필요
- 모든 워크플로를 관리하기 때문에 실패 지점이 될 수 있음

<br/>

## 코레오그래피(choreography)


## 출처 

- [https://microservices.io/patterns/data/saga.html](https://microservices.io/patterns/data/saga.html)
- [https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga](https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga)
- [https://docs.microsoft.com/en-us/azure/architecture/patterns/choreography](https://docs.microsoft.com/en-us/azure/architecture/patterns/choreography)
- [https://thebook.io/007035/ch04/02/01/03/](https://thebook.io/007035/ch04/02/01/03/)
- [https://sarc.io/index.php/development/2128-saga-pattern](https://sarc.io/index.php/development/2128-saga-pattern)