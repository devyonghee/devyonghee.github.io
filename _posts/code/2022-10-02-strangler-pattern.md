---
title: '[Design Pattern] 스트랭글러 패턴(Strangler Pattern)'
tags: [design-pattern, strangler-pattern]
categories: code
---

스트랭글러 패턴 (Strangler Pattern) 은 [마틴 파울러](https://martinfowler.com/bliki/StranglerFigApplication.html)가 정의한 패턴으로   
Strangler Fig Application 이라고도 하며 여기서 [Strangler Fig](https://en.wikipedia.org/wiki/Strangler_fig)는 호주 열대우림에 있는 교살 무화과 나무를 의미한다.  

<!--more-->

Strangler Fig 는 이름에서 알 수 있듯이 이 식물은 토양에 뿌리를 내릴 때까지
숙주 나무에 기생하면서 수년에 걸쳐 교삻하게 된다.  

{% include image.html alt="strangler" path="images/code/strangler-pattern/strangler.jpg" %}

스트랭글러 패턴 (Strangler Pattern)도 이와 비슷한 의미를 가진다.   
프로젝트의 규모가 점차 커지거나 복잡해지면 유지 관리하거나 추가가 어려워진다.  
특히, 복잡한 시스템을 완전히 교체하는 작업은 매우 어려워진다. 

그래서 기존 시스템을 유지하면서 점진적으로 새 시스템으로 마이그레이션하는 작업이 필요하다.   
이를 위한 디자인 패턴이 바로 스트랭글러 패턴 (Strangler Pattern)이다. 

기존 기능을 한번에 교체하지 않고 신규 기능으로 추가하여 특정 부분들을 점진적으로 대체한다.  
이 과정을 반복하면서 기존의 서비스를 제거한다.  

{% include image.html alt="strangler-pattern" path="images/code/strangler-pattern/strangler-pattern.png" %}

## 특징

- 코드를 한번에 변경하는 것보다 위험 부담 감소
- 잦은 릴리즈를 통해 진행 상황에 대해 점진적으로 검토 가능
- 새로운 프로그램을 설계할 때 미래에 쉽게 없앨 수 있도록 고려 


## 출처
- [https://martinfowler.com/bliki/StranglerFigApplication.html](https://martinfowler.com/bliki/StranglerFigApplication.html)