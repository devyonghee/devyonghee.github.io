---
title: '[DDD] DDD(Domain Driven Design) 용어 정리' 
tags: [ddd, domain-driven-design, theory]
categories: theory
---

DDD(Domain Driven Design, 도메인 주도 설계) 는 도메인을 중심으로 설계하는 방법론이다.   
소프트웨어 개발하면서 방대하고 복잡한 지식으로 인해 어려움이 생기는데, 도메인을 중심으로 설계하면 이 부담을 해소할 수 있다.  

<!--more-->

<br/>

## 도메인 모델 만들기

도메인 모델은 도메인과 관련된 지식을 엄격하게 구성하고 선택적으로 추상화 한 것이다.   
적절한 모델을 통해 정보를 이해하고 해결하고자 하는 문제 자체에 집중할 수 있다.  
DDD 에서는 다음과 같은 세 가지 용도에 따라 모델을 선택하게 된다. 

1. 핵심 설계를 위한 도메인 모델
   - 도메인 모델과 설계 및 구현은 긴밀한 관계를 가짐
   - 모델 이해를 근거하여 코드를 해석할 수 있기 때문에 유지보수와 기능 개선에 도움이 됨
2. 팀 구성원들의 중추적인 언어를 위한 도메인 모델
   - 이 모델을 토대로 프로그램 의견을 나눌 수 있음
   - 번역 절차가 필요하지 않음
3. 지식의 정수만을 추출하기 위한 도메인 모델
   - 용어를 선택, 개념 분류, 지식들을 연관 시키면서 팀원들의 사고 방식을 담을 수 있음
   - 많은 정보를 모델로 만들어서 효과적인 협업 가능

### Domain (도메인)

- 소프트웨어로 해결하고자 하는 문제 영역
- 한 도메인은 다시 하위 도메인으로 나누어질 수 있음

### Domain Model (도메인 모델)

- 도메인을 개념적으로 표현한 것 (ex. 클래스 다이어그램, 상태 다이어그램, 그래프 등)
- 여러 관계자들이 도메인을 이해하고 공유하는데 도움

### Ubiquitous Language(보편 언어)

{% include image.html alt="전문 용어 교차 지점에 형성된 ubiquitous language" source_txt='도메인 주도 설계' path="images/theory/ddd-terms-summary/ubiquitous-language.png" %}

프로젝트에서 사용되는 언어가 분열되면 심각한 문제가 발생된다.  
의사소통이 무뎌지고 지식 탐구를 빈약하게 만들기 때문에 조화가 깨지고, 신뢰할 수 없는 소프트웨어가 만들어진다.  
그러므로 프로젝트에는 탄탄한 토대가 될 수 있는 **공통 언어(Ubiquitous Language)** 가 필요하다.  

Ubiquitous Language 를 지속적으로 사용하면 모델의 취약점이 드러날 것이다.  
팀에서 언어에 공백이 발견되면 새로운 단어가 발견되고 이는 **도메인 모델의 변화**로 이어질 것이다.  

도메인 모델을 언어의 근간으로 사용하면서, 의사소통과 코드에 끊임없이 동일한 언어를 적용해야 한다.
표현을 계속 시도하면서 대화할 때 사용하는 용어의 혼란도를 해결해야 한다. 

- 도메인 전문가: 도메인을 이해하는데 부자연스럽고 부정확한 용어나 구조에 대해 반대 의사를 표명해야 함 
- 개발자: 설계를 어렵게 만드는 모호하거나 불일치 요소를 찾아내야 함

<br/>

## 모델 주도 설계의 기본 요소

{% include image.html alt="model-driven design 언어 내비게이션 맵" source_txt='도메인 주도 설계' path="images/theory/ddd-terms-summary/ddd-language-navigation-map.png" %}

내비게이션 맵을 통해 도메인 주도 설계 과정에 사용되는 패턴들이 서로 어떻게 관계를 맺는지 알아본다.

### Layered Architecture(계층형 아키텍처)

{% include image.html alt="layered architecture" source_txt='도메인 주도 설계' path="images/theory/ddd-terms-summary/layered-architecture.png" %}

도메인과 관련된 코드가 관련 없는 코드를 통해 널리 확산된다면 도메인에 대해 추론하기 어려워진다.  
복잡한 작업을 처리하는 소프트웨어를 만들기 위해서는 관심사의 분리를 통해 격리를 시켜야 각 설계 요소에 집중할 수 있다.

분리하는 많은 방법들 중에서는 Layered Architecture 가 널리 사용되고 있는데, 대다수는 네 가지 개념적 계층으로 나뉘어진다. 

- 표현 계층(사용자 인터페이스)
  - 사용자에게 정보를 보여주고 사용자의 명령을 해석하는 계층
  - 사람이 아닌 다른 컴퓨터 시스템이 외부 행위자가 될 수 있음
- 응용 계층(애플리케이션)
  - 소프트웨어가 수행할 작업을 정의하고 도메인 객체가 문제를 해결하는 계층
  - 업무상 중요하거나 다른 시스템의 응용 계층과 상호작용
  - 업무 규칙이나 지식이 포함되지 않고 얇게 유지되어야 함
- 도메인 계층
  - 업무 개념, 업무 상황, 업무 규칙을 표현하는 계층
  - 업무용 소프트웨어의 핵심 계층
- 인프라스트럭처 계층
  - 일반화된 기술적 기능 제공 (ex. 메시지 전송, 도메인 영속화, UI 위젯 그리기 등)
  - 네 가지 계층에 대한 상호작용 패턴 지원 가능
  - 도메인의 구체적인 지식을 포함하지 않아야 함

### Entity(엔티티, 참조객체)

- 일차적으로 해당 객체의 **식별성**으로 정의한 객체
- 객체의 생명주기 동안 형태와 내용이 바뀔 수 있지만 **연속성**은 유지되어야 함
- 클래스 정의를 단순하게 하고 생명주기의 **연속성**과 **식별성**에 집중
- 특정 속성보다는 정체성에 대해 초점을 맞춰야 함
- 식별 수단은 모델에서 식별성을 구분하는 방법과 일치해야 함
  - 특정 규칙에 따라 생성
  - UUID 사용
  - 값 직접 입력
  - 일련번호 사용(시퀀스나 DB 자동 증가)

### Value Object(값 객체)

- 개념적 **식별성을 갖지 않으면서** 도메인의 서술적 측면을 나타내는 객체
  - 어떤 요소의 속성에만 관심이 있다면 Value Object 로 구분하고 의미와 관련 기능 부여
- Value Object 가 Entity 를 참조할 수 있음
- 불변적(immutable)으로 다뤄야 함
- 식별성을 부여하면 안 됨
- Value Object 간의 양방향 연관관계는 제거해야 함

### Service(서비스)

- Entity 나 Value Object 에서 구현하지 못하는 **도메인 연산**
  - Entity 나 Value Object 의 일부를 구성하는 것이 아님
- 상태를 캡슐화하지 않음
- 연산의 명칭은 Ubiquitous Language 에서 유래되거나 반영되어야 함
- 서비스는 응용, 도메인, 인프라스트럭처로 여러 계층으로 분할 가능


### Module(모듈, 패키지)

- 모듈화를 통해 해당 모듈의 세부사항을 보거나, 모듈 간의 관계를 확인할 수 있음
- 하나의 의사소통 메커니즘
  - Ubiquitous Language 를 구성하는 것으로 모듈 이름 부여
- 모듈 간에는 **결합도가 낮아야 함**
  - 사람이 생각할 수 있는 양에 한계가 있음
  - 모듈화를 통해 다른 코드로부터 도메인 계층을 분리해야 함
- 모듈의 내부는 **응집도가 높아야 함**
  - 일관성이 없는 단편적인 생각은 이해가 어려움
  - 하나의 개념적 객체를 구현하는 코드는 모두 같은 모듈에 위치

### Aggregate(집합체)

- 데이터 변경의 단위로 다루는 연관 객체의 묶음
- 각 Aggregate 는 **루트(root)** 와 **경계(boundary)** 가 존재
- 루트는 Aggregate 마다 하나만 존재하며, 특정 Entity 를 가리킴
- 경계 바깥쪽의 객체는 루트를 통해서만 참조 가능
  - 루트를 통해서만 Aggregate 상태 변경 가능
- 루트는 Value Object 복사본을 다른 객체에 전달할 순 있음
- 루트 Entity 는 전역 식별성을 지니며, 불변식을 검사 책임이 있음
- 삭제 연산은 Aggregate 경계 안의 모든 요소를 한 번에 제거해야 함


## 통찰력을 위한 리팩터링

리팩터링이란 소프트웨어의 기능을 수정하지 않고 설계를 다시 하는 것이다.  
지속적으로 리팩터링을 수행하려면 설계가 유연하고 명확하여 표현할 수 있어야 한다.


### Factory (팩토리)

- 객체나 전체 Aggregate 의 복잡한 생성을 캡슐화
- 설계하는 방법으로 팩토리 메서드(factory method), 추상 팩토리(abstract factory), 빌더(builder) 패턴 등이 존재
- Entity Factory 와 Value Object Factory
  - Entity Factory: 필요한 필수 속성만 받아들이는 경향이 있음
  - Value Object Factory: 불변젹이므로 최정적인 형태로 만들어짐

#### Factory 설계 기본 요건

1. 생성 방법은 **원자적**, **불변식**을 모두 지켜야 함
2. 생성하고자 하는 타입으로 추상화 되어야 함 (Factory 패턴)


### Repository (리파지터리)

- 특정 타입의 모든 객체를 개념적 집합 (**컬렉션**처럼 동작)
- 데이터에 대한 실제 저장소와 질의 기술을 캡슐화하여 모델에 집중할 수 있게 도와줌
  - 데이터 소스로부터 도메인 설계를 분리
- 영속 객체는 해당 객체의 속성으로 전역적으로 접근할 수 있어야 함
- 직접 접근 해야하는 **Aggregate 루트**에 대해서만 Repository 를 제공
  - 마음대로 데이터베이스 질의를 한다면 도메인 객체와 Aggregate 캡슐화가 깨질 수 있음
- 질의의 수가 많으면 **Specification(명세)** 기반하여 질의를 수행
  - Specification: 특정 조건을 만족하는 객체를 찾는데 사용되는 객체
  - Specification 을 이용하면 유연한 질의를 수행 가능

#### Factory 와 Repository 차이

{% include image.html alt="Repository 는 Factory 를 이용해 존재하는 객체 재구성" source_txt='도메인 주도 설계' path="images/theory/ddd-terms-summary/repository-factory-reconstruction.png" %}
{% include image.html alt="클라이언트는 Repository 를 이용해 객체 저장" source_txt='도메인 주도 설계' path="images/theory/ddd-terms-summary/repository-factory-new-object-save.png" %}

- Factory: 새로운 객체 생성
  - 객체 생애의 초기 단계
- Repository: 기존 객체 조회
  - 객체 생애의 중간과 마지막 단계
  - 메모리 상에 객체가 존재하고 있는 것처럼 동작
   
### Specification (명세)

- 객체가 특정 기준을 만족하는지 판단하는 술어
- 특별한 목적을 위해 술어와 비슷한 명시적인 **Value Object**
- 규칙을 **도메인 계층**에 유지할 수 있음

#### Specification 용도

- 검증(validation)
  - Specification 의 개념을 가장 직관적으로 설명해주는 방식
  - 특정한 조건에 부합하는지 여부를 판단하기 위해 개별 객체 테스트
- 선택 (질의)
  - 특정한 조건을 기반으로 객체 컬렉션의 일부 선택 (필터링)
  - Specification 에 메서드를 추가하여 질의문(query) 을 캡슐화하여 사용할 수 있음
- 요청 구축(생성)
  - 명시된 조건을 만조가는 새로운 객체나 객체 집합을 새로 만들거나 재구성
  - 존재하지 않는 객체에 대한 기준을 명시


### 유연한 설계를 위한 패턴

{% include image.html alt="유연한 설계에 기여하는 패턴" source_txt='도메인 주도 설계' path="images/theory/ddd-terms-summary/flexble-design-pattern.png" %}

#### Intention-Revealing Interface (의도를 드러내는 인터페이스)

- 설계에 포함된 모든 요소(타입, 메서드, 인자 이름)가 인터페이스를 구성하고, 설계 의도를 드러냄
- 수행 방법이 아닌 결과와 목적만을 표현하도록 클래스와 연산의 이름을 부여 (Ubiquitous Language 용어를 따름)
- 연산을 추가하기 전에 행위에 대한 테스트 우선 작성

#### Side-Effect-Free Function (부수효과가 없는 함수)

- 함수(function)는 **부수효과를 일으키지 않고 항상 동일한 값 반환**
- 명령과 질의를 엄격하게 분리된 다른 연산으로 유지해야 함
  - 변경을 발생시키는 메서드는 데이터를 반환하지 않도록 함
- 명령과 질의 분리 대신 불변 객체 Value Object 활용할 수 있음

#### Assertion (단언)

- 자동화된 테스트나 프로그램 코드에 직접 연산의 사후조건과 클래스 및 Aggregate 의 불변식을 표현
- Assertion 을 의도적으로 추측할 수 있게 하고 응집도 높은 개념을 포함된 모델을 만들어야 함

#### Conceptual Contour (개념적 윤곽)

- 도메인의 설계 요소(연산, 인터페이스, 클래스, Aggregate) 를 응집력 있는 단위로 분해
- 리팩터링을 통해 변경되는 부분과 변경되지 않는 부분을 중심 축으로 식별하고 분리해야 함


#### Standalone Class (독립형 클래스)

- 무관한 모든 개념을 제거하여 클래스를 독립적(self-contained)으로 유지해야 함 (낮은 결합도)
- 의존성이 증가할수록 설계를 파악하기 어려워져 복잡도가 매우 높아짐

#### Closure Of Operation (연산의 닫힘)

- **반환 타입**과 **인자 타입**이 동일한 연산  
  - 구현자(implementer)가 연산에 사용된다면 인자, 반환, 구현자의 타입을 동일하게 정의
  - 부차적인 개념을 사용하지 않고도 **고수준의 인터페이스 제공**
- Value Object 연산을 정의하는데 주로 사용


## 출처 

- 도메인 주도 설계 소프트웨어의 복잡성을 다루는 지혜 / Eric Evans
- [https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga](https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga)