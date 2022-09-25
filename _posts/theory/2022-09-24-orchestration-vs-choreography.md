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


## 오케스트레이션(orchestration)

## 코레오그래피(choreography)


## 출처 

- [https://microservices.io/patterns/data/saga.html](https://microservices.io/patterns/data/saga.html)
- [https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga](https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga)
- [https://docs.microsoft.com/en-us/azure/architecture/patterns/choreography](https://docs.microsoft.com/en-us/azure/architecture/patterns/choreography)
- [https://thebook.io/007035/ch04/02/01/03/](https://thebook.io/007035/ch04/02/01/03/)
- [https://sarc.io/index.php/development/2128-saga-pattern](https://sarc.io/index.php/development/2128-saga-pattern)