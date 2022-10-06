---
title: '[Design Pattern] 싱글톤 패턴(Singleton Pattern)'
tags: [design-pattern, singleton-pattern]
categories: code
---

싱글톤 패턴 (Singleton Pattern) 은 인스턴스가 하나 뿐인 객체를 만들 수 있게 해주는 패턴이다.  
생성된 이후에는 객체를 새로 생성하지 않고 처음에 생성된 객체를 다시 재활용하게 된다.  

<!--more-->

싱글톤 패턴(Singleton Pattern)은 공통된 객체를 여러개 생성해야하는 경우에 많이 사용된다.  
대표적인 예로는 스레드 풀, 캐시, 사용자 설정, 로그 기록 객체, 커넥션 풀 등이 있다.  

동일한 행동을 하는 객체를 여러개 생성한다면 불필요한 메모리를 차지하거나 일관성에 문제가 생길 수 있다.  
싱글톤으로 생성한 인스턴스는 전역에서 공유하여 사용할 수 있으므로 이와 같은 문제들을 방지할 수 있다. 

### 싱글톤 패턴 장점

- 생성한 인스턴스를 공유하기 때문 메모리 낭비 방지
- 전역에서 사용되기 때문에 쉬운 데이터 공유
- 하나의 인스턴스만을 이용하기 때문에 일관성 유지 가능
- 유틸리티 클래스에 비해 내부에 캡슐화된 객체를 mock, fake 등으로 대체하여 테스트 가능

### 싱글톤 패턴 단점

싱글톤 패턴에는 다음과 같은 단점들이 존재하기 때문에 반드시 필요한 상황이 아니라면 지양하도록 한다.

- 사용되지 않는다면 메모리만 차지하게 될 수 있음
- 많은 역할을 담당하게 되면 결합도가 높아져 OCP(open close principle) 위반이 쉬움
  - 유틸리티 클래스와 비슷하여 안티 패턴 [엘레강트 오브젝트 Chapter3. 취업](https://devyonghee.github.io/book/2021/09/15/elegant-object-chapter3/#324-%EC%8B%B1%EA%B8%80%ED%86%A4singleton-%ED%8C%A8%ED%84%B4)
- 멀티 스레드 환경에서 2개의 인스턴스가 생기지 않도록 동기화 처리 필요

<br/> 

### 구현

#### Eager Initialization 

```java 

class SingletonEager {

    private static final SingletonEager INSTANCE = new SingletonEager();

    private SingletonEager() {
    }

    public static SingletonEager instance() {
        return INSTANCE;
    }

    public void doSomething() {
        System.out.println("doSomething");
    }
} 
```

- Class Loader 가 클래스를 로딩할 때 객체를 생성
- 인스턴스가 생성되기 전에는 스레드는 `INSTANCE` 에 접근할 수 없으므로 멀티 스레드 환경에서도 안전 
- 사용하지 않아도 인스턴스를 생성하기 때문에 메모리 차지
- Exception Handling 불가


### Static Block Initialization

```java 
class SingletonStaticBlock {

    private static final SingletonStaticBlock INSTANCE;

    static {
        try {
            INSTANCE = new SingletonStaticBlock();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private SingletonStaticBlock() {
    }

    public static SingletonStaticBlock instance() {
        return INSTANCE;
    }

    public void doSomething() {
        System.out.println("doSomething");
    }
}
```

- 대부분의 특징은 Eager Initialization 와 동일하나 Exception Handling 가능 




## 출처
- Head First Design Patterns
- https://readystory.tistory.com/116