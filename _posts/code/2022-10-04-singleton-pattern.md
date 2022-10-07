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


<br/> 

#### Static Block Initialization

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

<br/> 

#### Lazy Initialization

```java 
public class SingletonLazy {

    private static SingletonLazy instance;

    private SingletonLazy() {
    }

    public static SingletonLazy instance() {
        if (instance == null) {
            instance = new SingletonLazy();
        }
        return instance;
    }

    public void doSomething() {
        System.out.println("doSomething");
    }
}
```

- 클래스 로딩이 아닌 메소드가 호출되는 시점에 객체를 생성하기 때문에 메모리 낭비를 방지
- 멀티 스레드 환경에서는 여러 개의 객체가 생성될 수 있음

<br/> 

#### Thread Safe Singleton

```java 
public class SingletonThreadSafe {

    private volatile static SingletonThreadSafe instance;

    private SingletonThreadSafe() {
    }

    public static SingletonThreadSafe instance() {
        if (instance == null) {
            synchronized (SingletonThreadSafe.class) {
                if (instance == null) {
                    instance = new SingletonThreadSafe();
                }
            }
        }
        return instance;
    }

    public void doSomething() {
        System.out.println("doSomething");
    }
}
```

- Double Checked Locking (DCL) 를 이용하여 Lazy Initialization 의 동시성 문제 개선
- `synchronized` 키워드를 사용하여 성능 저하가 발생될 수 있음
- 마찬가지로 멀티 코어 환경 및 코드 재배치로 인해 객체를 두번 만들게 될 수 있으므로 권장되는 방식은 아님

<br/> 

#### Bill Pugh Singleton Implementation

```java 
public class SingletonBillPugh {

    private SingletonBillPugh() {
    }

    public static SingletonBillPugh instance() {
        return SingletonHolder.INSTANCE;
    }

    public void doSomething() {
        System.out.println("doSomething");
    }

    public static class SingletonHolder {
        
        private static final SingletonBillPugh INSTANCE = new SingletonBillPugh();
    }
}
```

- Bill Pugh 가 제시한 내부 정적 클래스를 이용하여 싱글톤 생성 방식
- `SingletonHolder` 클래스가 로드되는 시점(`instance()` 호출 시점)에 인스턴스 생성 
- `SingletonHolder` 클래스가 로드되는 시점에 객체를 생성하기 때문에 thread safe

<br/> 

#### Enum Singleton

```java 
public enum SingletonEnum {

    INSTANCE;
    public void doSomething() {
        System.out.println("doSomething");
    }
}
```

- [이펙티브 자바 아이템 89](https://devyonghee.github.io/book/2022/02/03/effective-java-chapter12/#%EC%95%84%EC%9D%B4%ED%85%9C-89.-%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4-%EC%88%98%EB%A5%BC-%ED%86%B5%EC%A0%9C%ED%95%B4%EC%95%BC-%ED%95%9C%EB%8B%A4%EB%A9%B4-readResolve-%EB%B3%B4%EB%8B%A4%EB%8A%94-%EC%97%B4%EA%B1%B0-%ED%83%80%EC%9E%85%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%9D%BC) 에서 제시한 방법
- 구현이 간단하며 thread safe
- Reflection 및 직렬화에 대해 인스턴스 수 보장 가능 


전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/singleton) 참고


## 출처
- Head First Design Patterns
- https://readystory.tistory.com/116
- https://velog.io/@dailyzett/singleton