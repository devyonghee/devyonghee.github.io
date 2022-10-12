---
title: '[Design Pattern] 책임 연쇄 패턴(Chain of Responsibility Pattern)'
tags: [design-pattern, chain-of-responsibility-pattern]
categories: code
---

책임 연쇄 패턴(Chain of Responsibility Pattern)은 다수의 객체를 체인 형태로 연결하여 처리하는 패턴이다.  
GoF(Gang of Four) Design Pattern 에서 행위(behavioral) 패턴에 속한다.

<!--more-->

책임 연쇄 패턴은 처리 객체들을 집합으로 만들어 클라이언트의 요청을 받는다.  
요청을 받은 객체는 자신이 처리할 지 연결된 다음 객체로 책임을 부여할 지 결정한다.  
이렇게 클라이언트의 요청은 객체들을 순차적으로 회전하면서 처리 객체를 결정하고 실행된다.  

책임 연쇄 패턴은 주로 처리할 수 있는 객체가 여러 개이고 처리 객체가 특정되어 있지 않은 경우 사용한다.

## 구조 

{% include image.html alt="chain of responsibility pattern structure" path="images/code/chain-of-responsibility-pattern/structure.png" %}

{% include image.html alt="chain of responsibility pattern sequence" path="images/code/chain-of-responsibility-pattern/sequence.png" %}

- Handler: 요청을 객체 집합에 전달하는 역할
- ConcreteHandler : 요청을 실제 처리하는 역할


## 장점

- 요청하는 객체와 처리하는 객체를 분리하여 느슨한 결합도 유지 가능
- 클라이언트는 처리 객체 집합 내부 구조를 알 필요가 없음
- 새로운 처리 객체 생성 간단

## 단점

- 요청이 처리 객체들간에 순환이 발생될 수 있음
- 내부 어느곳에서 요청이 처리되는지 파악이 어려움

## 구현

### Handler

```java 

public abstract class Handler {

    private Handler next;

    public void setNext(Handler next) {
        this.next = next;
    }

    public void handle(String request) {
        if (canNotHandle(request)) {
            validateExistNext();
            next.handle(request);
            return;
        }
        doHandle(request);
    }

    protected abstract boolean canNotHandle(String request);

    protected abstract void doHandle(String request);

    private void validateExistNext() {
        if (next == null) {
            throw new IllegalStateException("next handler is not exists");
        }
    }
}
```


### Concrete

```java 
public class ConcreteHandler1 extends Handler {

    @Override
    protected boolean canNotHandle(String request) {
        return !"concrete1".equals(request);
    }

    @Override
    protected void doHandle(String request) {
        System.out.println("ConcreteHandler1 print " + request);
    }
}

public class ConcreteHandler2 extends Handler {

    @Override
    protected boolean canNotHandle(String request) {
        return !"concrete2".equals(request);
    }

    @Override
    protected void doHandle(String request) {
        System.out.println("ConcreteHandler2 print " + request);
    }
}

```

전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/chain-of-responsibility) 참고

## 출처

- [https://always-intern.tistory.com/1](https://always-intern.tistory.com/1)
- [https://donghyeon.dev/design%20pattern/2020/05/11/Chain-of-Responsibility-%ED%8C%A8%ED%84%B4/](https://donghyeon.dev/design%20pattern/2020/05/11/Chain-of-Responsibility-%ED%8C%A8%ED%84%B4/)
- [https://ko.wikipedia.org/wiki/%EC%B1%85%EC%9E%84_%EC%97%B0%EC%87%84_%ED%8C%A8%ED%84%B4](https://ko.wikipedia.org/wiki/%EC%B1%85%EC%9E%84_%EC%97%B0%EC%87%84_%ED%8C%A8%ED%84%B4)
