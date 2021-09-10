---
title: 코드 스피츠 Object83 3회차 정리
tags: [lecture, book, object, OOP]
categories: lecture
---

객체 통신 구조가 순환이 돌면 잘못된 설계이다.  
SOLID 원칙, GRASP 패턴 등 다양한 원칙과 패턴을 이용하여 객체를 설계하자.   

<!--more-->

## 객체망과 객체간 통신

객체지향에서 가장 중요한 핵심은 책임이다. 
객체간에 책임을 주고받기 위해 메세지를 사용하게 되는데 어떤 객체한테 책임을 할당하고 메세지를 구성 하는것이 설계의 목표이다.
이 책에서는 설계를 코드를 배치하는 기술이라고 한다. 
다시 말해, 설계는 코드를 절차적으로 배치하지 않고 객체지향 원리에 따라서 객체간에 나눠서 배치하는 것이다.
이 코드를 배치하는 방법에 따라 향후 유지 보수 확장의 난이도가 결정된다.

객체의 책임을 분배하기 위해 메세지를 통신하고 있는데 우리는 이 객체들의 네트워크를 생각할 수 있다.
그래서 책임 역할 모델 기반으로 객체간 분리가 잘 되어 있는 코드의 형태를 **객체망(object network)** 이라고 한다.
이 **객체망** 에 소속되어 있는 객체들끼리 메세지를 주고받으면서 책임을 분산해야 한다는 것인데
그래서 우리는 **객체망** 에 대해서 이해할 필요가 있다. 
하지만 실제 객체 통신이 무엇인지는 이해하는 것은 굉장히 어렵다.


{% include image.html alt="object-network" path="/images/lecture/code-spitz/object-network.jpg" %}

우리가 알고 있는 객체는 내부의 정보는 은닉하고 있고 캡슐화를 이용하고 외부 소통은 메소드를 통한다.
가장 기본적인 형태는 내부가 숨겨진 다수의 객체들끼리는 public interface 를 통해서 메세지를 주고 받는것 이다.

하지만 현실에서 객체는 역할과 책임이 다르기 때문에 위와 같이 생기지 않았다.
객체의 책임은 수용해야 할 업무지만 역할은 그 객체가 당면한 측면이다.
은닉하고 있는 데이터를 자기만이 컨트롤할 수 있어야 하는데 결국 그 데이터를 기준으로 책임이 주어진다. 
하지만 데이터는 역할에 반영되지 않고 객체를 둘러싸고 있는 인터페이스가 역할에 반영되어야 한다.

{% include image.html alt="object-network-interface" path="/images/lecture/code-spitz/object-network-interface.jpg" %}

현실 세계의 객체는 위와 같이 생겼다. 
내부 상태는 캡슐화 되어있고 은닉되어있지만 외부에 보여지는 것은 여러가지 **역할** 이다. 
어떤 역할에 참여하냐에 따라 그때 그때 책임이 달라진다.
데이터로부터 발현되는 메소드는 해당 객체만이 가질 수 밖에 없으므로 우리가 할 수 있는건 다른 측면을 반영해주는 것이다.

객체간 통신은 역할의 형태에 따라 통신하기 때문에 파랑색이 초록색을 통신할 때 관점과 갈색이 초록색을 통신할때 관점이 다르다.
객체는 하나의 뭉쳐진 덩어리가 아니라 역할별로 여러개가 분리되어 있음과 동시에 각각 분리해서 형으로 인식할 수 있다.
다양한 측면에서 모든 인터페이스를 구현한 객체가 바로 **역할** 인 것이다.

책에서 나온 예시에는 스크리닝은 상영된 시간만 알고 있지만 스크리닝만이 이 정보를 알고 있어서 reservator 의 역할도 하고 있다. 
screening 을 reservator 로 implements 선언했다면 reservator.reserve() 형태로 되서 자연스러웠겠지만
여기서는 screening.reserve() 형태이기 때문에 모순이 된다.
screening에 reserve 메서드가 존재하는지 아무도 모른다. 

## 통신망의 구성

{% include image.html alt="network-structure1" path="/images/lecture/code-spitz/network-structure1.jpg" %}

도메인을 객체 망 협력의 메세지망으로 표현, 번역하는 것이 굉장히 중요하다.
코드를 그렇게 분산할 수 있고 틀을 만들고 메세지를 연결할 수 있도록 하는게 객체 설계이다.

{% include image.html alt="network-structure2" path="/images/lecture/code-spitz/network-structure2.jpg" %}

위 그림에서 왼쪽은 **비선형구조** 오른쪽은 **선형구조** 라고하는데 **서큘러** 라고도 한다.
일반적으로 오른쪽과 같이 순환하는 통신망이 만들어지면 잘못된 것이다.
실제 코드에서는 망이 너무 크기 때문에 순환되는 구조를 파악할 수 없다.
그래서 설계를 배우는 목적중 하나는 설계 원칙을 지켜서 이러한 선형 구조를 일어나지 않도록 설게를 하는 것이다.

위 두 그림에서 공통점은 단방향 참조로만 이루어져 있는 것이다.
우리 설계의 가장 큰 목표 중에 한가지는 의존성을 제거할 순 없지만 의존성을 간단하게 하는 것이다.
우리의 목표는 의존성을 무조건 단방향으로 만드는 것이다.

## 객체 설계 난점

### 인터페이스의 그룹화

인터페이스가 특정 책임을 나타내는 것이고 가장 좋은 인터페이스는 아무 메서드도 없는 것인데 
이런 인터페이스를 만드는 이유는 전부 도메인으로부터 발현된다. 
우리가 바라보는 도메인에서 객체를 한가지 측면으로만 바라볼 수 없다. 

{% include image.html alt="interface-group" path="/images/lecture/code-spitz/interface-group.jpg" %}

도메인 A관점의 ABCD 라는 인터페이스가 도출된다면, 
도메인 B관점으로 객체를 바라보면 또다른 abcd가 도출된다
네트워크 관점에서 봤을 때 인터페이스, 모델링 관점에서 바라본 인터페이스도 달라질 수 있다.
문제는 하나의 객체는 그 본질적인 데이터때문에 수용해야하는 관점이 굉장히 많고 많은 인터페이스를 구현해야 한다는 점이다.

 
## 알려진 기본 설계 요령

### SOLID 원칙

#### <mark>S</mark>RP Single Responsibility  단일 책임 원칙 - 책 117 쪽

**SRP** 에서의 책임이라는 것은 변화의 이유, 수정의 이유를 의미하는데 
이 원칙은 객체의 코드를 수정해야 하는 이유를 하나로만 만들어야 한다는 것이다.
그렇게 되려면 변화율에 따라서 객체를 분리해서 만들어야 한다.
변화율이란 변경되는 시간, 이유를 포함하고 있는데 서로 변하는 주기나 이유가 다르기 때문에 객체를 나눠야 한다.
결국, 단일 책임이라는 것은 변화하는 이유가 하나만 되도록 설계를 하라는 것이다. 

이 원칙을 지키기 위한 좋은 방법은 변화율에 대해서 처리하는 것과 쓸데없는 책임을 벗어나게 하는 것이다.  
**SRP** 는 주로 스프링에서 aop에서 많이 언급된다. 
 

> 단일 책임 원칙  
> 로버트 마틴은 모듈의응집도가 변경과 연관이 있다는 사실을 강조하기 위해 단일 책임 원칙이라는 설계 원칙을 제시했다.
> 단일 책임 원칙을 한마디로 요약하면 클래스는 단 한 가지의 변경 이유만 가져야 한다는 것이다.
> 한 가지 주의할 점은 단일 책임 원칙이라는 맥락에서 '책임' 이라는 말이 '변경의 이유'라는 의미로 사용된다는 점이다.
> 단일 책임 원칙에서의 책임은 지금까지 살펴본 역할, 책임, 협력에서 이양기하는 책임과는 다르며 변경과 관련된 더 큰 개념을 가리킨다.

**SRP** 가 지켜지지 않을 때, 한가지 이유 때문에 수많은 클래스를 수정하게 되는 일이 발생된다.
이 현상을 **shogun surgery(산탄총 수술)** 이라고 한다.
shogun surgery가 일어나지 않게 하려면 **변화하는 이유(트리거)** 가 하나가 되도록 
클래스를 나눠서 구축해야한다.

#### <mark>O</mark>CP Open Close 개방 폐쇄 원칙

Open 은 확장 열려 있고 Close 수정에 닫혀 있어야 한다는 의미이다.
open close를 가장 쉽게 달성할 수 있는 방법은 a가 b를 직접 참조하지 않고 추상형이나 어댑터 같은걸 참고 하는 방법이 있다. 
이렇게 되면 a와 b의 직접적인 관계를 끊어버림으로써 b는 확장에 자유롭고 a는 b를 수정해도 건드리지 않도록 할 수 있다.  
결국, open close 는 구현보다는 인터페이스를 참고하라는 것이다.

#### <mark>L</mark>SP Liskov Substitution 업캐스팅 안전
부모클래스 자리에는 자식 클래스를 넣을 수 있다는 의미이다.
당연한 말 같지만 다음을 보자.

{% include image.html alt="LSP1" path="/images/lecture/code-spitz/LSP1.jpg" %}

추상층이 너무 구체적이면 구현층에서 모순이 발생하게 된다.
즉, **리스코프 치환 원칙은 추상층을 어떻게 잘 만들 것인지에 대한 원칙** 이다.

사람이나 타조한테 숨을 쉰다, 다리 이동한다는 것을 하면 되지만,
아메바나 독수리, 고래 같은 경우에는 성립되지 않는다.
대표하고 있는 생물이라는 추상층이 모든 도메인을 반영하지 못한다.
추상층이 가지면 안되는 구현층의 영역을 가져서 문제가 생긴 것이다.
리스코프 치환 원칙을 달성하려면 추상층이 구현층의 확장을 포용할 수 있는 교집합만 가지고 있어야야 한다는 것이다.
위 와같은 문제가 발생하면 우리는 바로 제거하거나 수정할 수 있어야 한다.
{% include image.html alt="LSP2" path="/images/lecture/code-spitz/LSP2.jpg" %}

위와 같이 추상층에 숨을 쉬는 생물과 다리로 이동하는 다리이동 인터페이스로 분리해서 
중복을 제거하고 다시 전개를 해야한다.
 
리스코프 치환 원칙을 지키기 어려운 이유는 실제로 추상층을 정의하기가 어렵기 때문이다.
모든걸 객체를 기억하고 모든 모순점을 파악해야지만 추상층을 찾아낼 수 있는 것이다.

리스코프 치환 원칙으로 정한 이유는 후회하지 말고 발견했을 때 즉시 추상층부터 고쳐야 한다는 의미이다.
모순점을 발견하고 계속 예외로 처리하게 되면 늦어지기 때문에 모순점을 발견한 순간 추상층을 수정하라는 원칙이다.


#### <mark>I</mark>SP interface Segregation 인터페이스 분리
구상형으로 쓰지말고 인터페이스로 분리해야 된다는 의미이다.
{% include image.html alt="ISP1" path="/images/lecture/code-spitz/ISP1.jpg" %}

어떤 객체의 메소드가 6개가 있다고 생각하고 각 2개씩 메소드는 A B C 모듈을 위한 메서드로 정의하면 안된다.
인터페이스의 분리가 안됐으므로 잘못된 것이다.
{% include image.html alt="ISP2" path="/images/lecture/code-spitz/ISP2.jpg" %}

해결 방법은 각 인터페이스가 만족하는 객체로 쪼갠 다음에 소유하는 것이다.
이 방법을 사용하면 각 모듈이 소유된 객체하고만 대화할 수 있도록 해야 한다.
{% include image.html alt="ISP3" path="/images/lecture/code-spitz/ISP3.jpg" %}
일반적으로 우리가 알고 있는 인터페이스 모델로 재정의하면 그 위그림처럼 된다.
이렇게 하면 메서드 접근권한을 형으로 막을 수 있는 것이다.


#### <mark>D</mark>IP Dependency Inversion 다운캐스팅 금지

고차원의 모듈은 저차원의 모듈에 의존하면 안된다.
두 모듈 모두 추상화된 것에 의존해야 한다.

추상화 된 것은 구체적인 것에 의존하면 안 된다.
구체적인 것이 추상화된 것에 의존해야 한다.

 
### SOLID 외의 다른 원칙

#### DI Dependency Injection(의존성 주입)
구축 방법이 여러가지가 있는데 그 중에 (**IoC Inversion of Control 제어 역전**)가 존재한다.

#### DRY Don`t Repeat Yourself (중복 방지)
어디서나 통용되는 원칙
가장 핵심적인 부분은 우리는 생각보다 멍청하다는 것이다.
따라서, 같은 코드를 여러 곳에 작성했다면 그 코드를 동시에 수정할 확률은 거의 0라고 보는 것이다.
 
#### Hollywood Principle (의존성 부패방지)
묻지말고 시켜라.
물어보지말고 시키는 원칙을 가져라.
물어보게되면 내부 사정에 대해서 많은 정보를 알게 되버린다. 
물어보는 순간 내부 사정과 연동되버리게 되는데 이게 바로 의존성이 부패된 것이다.
getter를 써야 하는 경우에는 의존성 부패 방지를 어기게 되므로 예외로 선언하지 않는 이상 사용하지 않아야 한다. 

#### Low of demeter 최소성 지식
classA.methodA의 최대지식한계
- classA의 필드 객체
- methodA 가 생성한 객체
- methodA 의 인자로 넘어온 객체

더 이상 의존성이 확장되지 않게끔 직접 알고있는 1차 관계들만 이용해서 구현해야 한다.
1차 연결을 허용할 수 없는 것들은 내부 객체에 대한 wrapping 메소드를 통해서 따로 제공해줘야 한다.

디미터의 법칙을 어기면 train wreck(열차 전복) 이 일어나게 된다.
이러면 a에 대한 지식 b에 대한 지식 전부 알아야 되고 그 외에도 계속 알아야 된다.


### Hollywood Principle(의존성 부패방지)와 Low of demeter(최소 지식)의 모순

두 원칙을 지키면 해당 객체와 메세지를 주고 받는 것은 가능 하지만 내부를 들여다볼 방법이 없음
우리가 던진 메세지가 제대로 동작하는지 확인할 수 있는 수단이 필요하다.

> 객체 통신망 - 객체는 메세지를 주고 받는다.

{% include image.html alt="hollywood-with-low-demeter" path="/images/lecture/code-spitz/hollywood-with-low-demeter.jpg" %}

우리의 주요한 목표는 확인할 대상이 메세지가 수신됐는지 확인하는 것인데 이 두 원칙 때문에 객체 내부를 확인할 수 없다. 
하지만 해당 객체가 제대로 통신하는지 확인하기 위해서는 회색, 빨간색, 파란색으로 충분하다.
회색 객체가 트리거인 메세지를 요청했을 때, 
그 결과로 파란색과 빨간색가 메세지를 받았는지 확인하면 가운데 객체가 제대로 처리하고 있다는 것을 확인할 수 있다.

결국 객체가 제대로 작동하는가를 테스트하려면
1. 객체 통신망에서 테스트할 객체에게 메세지 송신 (가운데가 대상 객체)
2. 그 객체가 이웃 객체에게 메세지를 잘 보냈는지 확인
3. 3번을 위해 통신한 이웃 객체를 조사하면 된다.

다음은 이웃한 객체의 내부를 들여다볼 방법 없이 확인할 수 있는 방법이다.

#### Mock 객체를 활용한 검증

{% include image.html alt="mock-test" path="/images/lecture/code-spitz/mock-test.jpg" %}

mockery (모조객체) 와 mock(목객체)를 활용하는 것이다.
mock 객체는 대충 환경을 조성하기 위해서 사용하는 것이아니라 
객체망을 통해서 해당 객체를 투영해서 볼 수 없으므로 객체망에 대한 검증을 하기 위 해사용한다.
여기서는 회색, 파란색, 빨간색이 mock 객체가 될 대상이다. 이걸 통해서 대상 객체가 제대로 통신하는지 검증하는 것이다.

> mockery (모조객체) = context: 테스트 관리 객체
> mock(목객체): 테스트용 모의 객체

1. 필요한 목객체를 생성하고
2. 테스트할 객체를 둘러싼 객체망을 구성한 뒤(DI)
3. 트리거가 되는 메세지를 일으켜
4. 각 목객체의 상태를 확인한다.

객체망에 참가하는 객체를 테스트하는 방법은 이러한 방법밖에 없다.


## GRASP (General Responsibility Assignment Software Patterns)
켄트 벡은 적용할 수 있는 레벨을 여러가지로 분류했는데
1. 원칙 (무조건 지켜야 하는것)
2. 가치 (돈이 되는 행위, 디버깅이 덜 일어나는 행위)
3. 패턴 (원칙과 가치를 지키면서 반복적으로 하면서 나타는 모범 답안)

다양한 환경 변화가 있기 때문에 꼭 옳은 것은 아니지만 많은 경우에 적용되는 패턴이 있다.
객체지향 원리를 좀 더 약한 범위에서 적용할 수 있게끔 쉽게 풀어 놓은 것이다.(응용범위는 좁을 수 있음)
여기서부터는 그 패턴을 설명한다.

### GRASP 에 대한 패턴 9가지
- 정보 담당자 Information Expert
- 소유권한 Creator
- 컨트롤러 Controller
- 낮은 연결 Low Coupling
- 높은 응집도 High Cohesion
- 간접 참조 Indirection
- 다형성 Polymorphism
- 순수 조립 Pure Fabrication
- 변화 보호 Protected Variations

### 1. Information Expert
- 해당 정보를 갖고 있는 객체에게 책임을 할당하라.
- 객체의 본질과 데이터 은닉을 지킬 수 있는 패턴이다.
- 은닉성 그 자체를 의미, 데이터 은닉을 지키고 싶다면 데이터를 갖고 있는 객체가 책임을 가지면 좋다.

### 2. Creator
- 객체 시스템의 이질적인 부분인 생성 시에도 정보전문가 패턴을 따르자.
- 어떤 객체가 다른 객체를 포함하거나, 이용하거나, 부분으로 삼거나, 잘 알고 있다면 그 객체를 생성하게 시키자.

> ex) `Screening`이 `Reservation`을 만드는 데 적당했던 이유는 `Reservation`에 들어가는 필드 정보를 대부분 `Screening` 알고 있었기 때문이다.

### 3. Controller
- 컨트롤러는 어떤 일을 중계할 때 직접 접촉하는게 나은지 아닌지를 판별하는 것
- 컨트롤러는 어댑터 패턴과 미디에이터 패턴을 공통적으로 한번에 적용할 필요가 있다면 Controller 패턴을 이용하라
- 미디에이터 패턴의 설계판 확장으로 서브시스템으로 묶을 수 있다면 컨트롤러를 도입하자
- 대표적인 패턴이 mvc 패턴이다.

> 미디에이터 패턴 : 다수의 객체가 다수를 알아야 할 경우 
> 아는 객체망이 복잡하기 때문에 미디에이터를 중심에 두고 
> 미디에이터가 다 알게 한 다음에 다른 애들도 미디에이터를 알게 한다는 것
> 미디에이터를 통해서 다른 객체에게 시키고 싶은 일을 전달하면 된다.

### 4. Low Coupling & High Cohesion
- 결합도를 낮추고 응집도를 높이는 패턴은 다른 양상으로 나타남.
- 결합도를 낮추려면 아는 객체 수를 줄여야 함. 
- 응집도를 높이려면 객체를 도출할 때부터 변화율을 고려해야 함.
- Low Coupling의 가장 큰 목표는 단방향 의존성이다. 양방향 참조가 있다면 무조건 없애야 한다. 

### Protected Variations
- 추상적인 수준에서 책임을 정의하여 다양한 구상가능성으로부터 사용할 모듈을 보호하라.
- 인터페이스 분리 원칙 적용(ISP)
- 현실 세계 객체의 공통점을 찾기가 굉장히 어렵다. (억지로 찾는다고 의미는 없다)
- 추상화하는 이유는 책임을 할당하기 위해서지 공통점을 찾기 위해서 하는 것이 아니기 때문이다.

### Polymorphism
- 전략패턴처럼 분기가 예상되는 책임이라면 다형성을 이용하라.
- 인터페이스 분리와 비슷할 것 같지만 전략 패턴의 의미을 의미. 
- 하는 행동이 추상적으로는 의미가 같지만 실제 하는 행동을 여러 가지로 달라질 수 있다.
- 추상형을 받아들이고 구상적인 것들은 나중에 형이 대체할 수 있게끔 바꿔주는게 좋다.


### Pure Fabrication
- 공통 된 기능이나 순수기능적인 객체는 따로 모아서 작성한다.
- 공통되는 기능이 있으면 추상층으로 빼든지 공통클래스로 빼든지 빼내야 한다.
- 디자인 패턴중에 가장 깊고 많이 써야되는 패턴은 템플릿 메소드 패턴과 스트래티지 패턴인 것이다.

 
### Indirection
- 직접 참조관계를 피하고 중계 객체를 이용하면 개별 객체의 충격을 중계 객체에서 흡수할 수 있다.
- 컴파일러 수준에서 제공하고 있는 포인터의 포인터가 바로 인터페이스 같은 추상형을 이용
- 직접 만든 객체에서 데코레이터 패턴이나 어댑터 패턴을 사용한다면 직접 명령을 내리는 것이 아니기 때문에 간접 참조를 하게 되는 것이다.
- Indirection은 SOLID 원칙에서 Open Close 원칙을 그대로 의미하고 있다.


## Theater


```java 

public class Movie<T extends DiscountPolicy & DiscountCondition> {
    private final String title;
    private final Duration runningTime;
    private final Money fee;
    private final DiscountPolicy policy;

    public Movie(String title, Duration runningTime, Money fee, DiscountPolicy policy) {
        this.title = title;
        this.runningTime = runningTime;
        this.fee = fee;
        this.policy = policy;
    }

    Money calculateFee(Screening screening, int count) {
        return policy.calculateFee(screening, count, fee);
    }
}

``` 

`movie`의 지식을 줄이기 위해서 `policy` 한테 `condition`을 넣어줬다.
이 상태에서 movie 가 중간에 `policy` 를 변경할 수 있게 된다면 
`policy`를 교체할 때 `condition`을 다시 생성해서 넣어줘야하는 문제가 생기게 된다.
그렇게 되면 객체는 식별자로 구분하기 때문에 `condition`을 생성해서 넣어주면 같은 조건이 아니게 된다.


```java 
abstract class DiscountPolicy {
    private Set<DiscountCondition> conditions = new HashSet<>();

    public void addCondition(DiscountCondition condition) {
        conditions.add(condition);
    }

    public void copyCondition(DiscountPolicy policy) {
        policy.conditions.addAll(conditions);
    }

    public Money calculateFee(Screening screening, int count, Money fee) {
        for (DiscountCondition condition : conditions) {
            if (condition.isSatisfiedBy(screening, count)) return calculateFee(fee);
        }
        return fee;
    }

    protected abstract Money calculateFee(Money fee);
}

```

`condition`에 대한 소유권을 `policy` 한테 줬기 때문에 내부 `condition`을 옮겨서
다른 `policy` 한테 주는 기능이 반드시 필요하다. 
`policy`가 `theater`의 `condition`을 가져오면서 동시에 `condition`을 옮겨야 하는 책임이 같이 할당된다.
`condition`을 유지하는 `policy`를 자유롭게 교체해주고자 `condition`을 복사하는 메서드를 추가한다.
객체에서 의존성을 함부로 조정하거나 소유권을 함부로 이전하면 그 여파가 반드시 온다.

그러면 여기서 추상클래스에 있는 템플릿 메서드가 발동하고 
구상 클래스한테 위임할 훅이 발동한다.
부모 층에서 구현해야할 공통 로직이나 공통 상태가 있다라고 확신하면 템플릿 메서드를 사용하고
인터페이스로서의 `calculateFee` 밖에 없다면 전략 패턴을 사용한다.
구현이 공통이 없거나 상태 공통이 없다고 확정지을 수 없을 만큼 유연해야 할 때는 전략 패턴을 쓰게 되고
로직이나 상태가 공통된다고 어느정도 형이 한정되있다고 생각한다면 템플릿 메소드를 사용하는게 유리하다.



```java 

public class AmountPolicy extends DiscountPolicy {
    public final Money amount;

    public AmountPolicy(Money amount) {
        this.amount = amount;
    }

    @Override
    protected Money calculateFee(Money fee) {
        return fee.minus(amount);
    }
}

public class PercentPolicy extends DiscountPolicy {
    public final Double percent;

    public PercentPolicy(Double percent) {
        this.percent = percent;
    }

    @Override
    protected Money calculateFee(Money fee) {
        return fee.minus(fee.multi(percent));
    }
}

```


```java

public class TicketSeller {
    private TicketOffice ticketOffice;

    public void setTicketOffice(TicketOffice ticketOffice) {
        this.ticketOffice = ticketOffice;
    }

    Reservation reserve(Customer customer, Theater theater, Movie movie, Screening screening, int count) {
        Reservation reservation = Reservation.NONE;
        Money price = movie.calculateFee(screening, count);   // 디미터 원칙 위반
        if (customer.hasAmount(price)) {
            reservation = ticketOffice.reserve(theater, movie, screening, count);
            if (reservation != Reservation.NONE) customer.minusAmount(price);
        }
        return reservation;
    }
}

```

`TicketSeller`를 보면 모든 인자를 지식들을 의존성을 가지고 있는데 
여기서는 이것들을 `ticketOffice`로 전달해줘야 하기 때문에 형으로는 강제할 수 없다.
도메인상 이 인자들이 전부 주어지고 있지만 실제로 여기서는 이 의존성들을 사용하면 안된다.
중계에서 인자를 주기 위해서 받았을 뿐이지 사용하기 위함은 아닌 것이다. 
(자바에서는 표현할 수 없지만 다른 언어에는 존재)

위 코드에서 `movie.calculateFee` 를 호출하면서 직접 코드를 사용하고 있다.
중계하는데 인자로써만 갖고있던 의존성을 사용하면 안되기 때문에 이 코드는 잘못된 코드이다.
`movie.calculateFee` 때문에 중계 역할에서 `movie`에 대한 의존성도 생겨버리게 된 것이다.

`TicketSeller`는 `TicketOffice` 하고만 직접적인 관계니까 
디미터의 원칙에 의해서 `TicketOffice` 에 맡겨야 한다.
코드를 아래와 같이 수정해야 한다


```java 

public class TicketSeller {
    private TicketOffice ticketOffice;

    public void setTicketOffice(TicketOffice ticketOffice) {
        this.ticketOffice = ticketOffice;
    }

    Reservation reserve(Customer customer, Theater theater, Movie movie, Screening screening, int count) {
        Reservation reservation = Reservation.NONE;
        Money price = ticketOffice.calculateFee(screening, count);  // ticketOffice에게 맡기는 걸로 수정
        if (customer.hasAmount(price)) {
            reservation = ticketOffice.reserve(theater, movie, screening, count);
            if (reservation != Reservation.NONE) customer.minusAmount(price);
        }
        return reservation;
    }
}

```

