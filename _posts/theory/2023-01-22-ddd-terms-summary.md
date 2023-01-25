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



## 출처 

- 도메인 주도 설계 소프트웨어의 복잡성을 다루는 지혜 / Eric Evans
- [https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga](https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga)