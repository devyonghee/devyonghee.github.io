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





## 출처 

- 도메인 주도 설계 소프트웨어의 복잡성을 다루는 지혜 / Eric Evans
- [https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga](https://learn.microsoft.com/ko-kr/azure/architecture/reference-architectures/saga/saga)