---
title: 이펙티브 자바 Chapter11. 동시성
tags: [book, effective-java]
categories: book
---


이펙티브 자바 11장에서는 동시성 프로그램을  
명확하고 정확하게 만들고 문서화하는 방법에 대해 소개한다.

<!--more-->

<br/>

## 아이템 78. 공유 중인 가변 데이터는 동기화해 사용하라

- **동기화**는 스레드 사이의 **안정적인 통신**에 필요
  - 동기화에 실패하면 처참한 결과를 초래 (ex. 응답 불가 상태)
  - `Thread.stop()` 사용금지
    - **폴링**하면서 값이 변경되면 멈추도록 하는 것이 안전
  - **동기화**(`synchronized`) 메소드로 데이터 접근해서 사용 (쓰기와 읽기 모두 동기화 필요) 
  - `volatile` 선언한 필드를 이용하면 동기화 생략 가능
    - **증가 연산자**(`++`)의 경우, **안전 실패(safety failure)** 오류 발생, 동기화가 필요
    - 참고. `AtomicLong`
- 가급적 **가변 데이터**는 **단일 스레드**에서만 사용
  - **불변 데이터**만 공유
  - **프레임워크**와 **라이브러리**에 대해 깊이 이해할 필요가 있음

<br/>

## 아이템 79. 과도한 동기화는 피하라

- 메서드나 동기화 블럭 안에서 제어를 클라이언트에게 양도하면 안됨
  - 과도한 동기화는 성능 저하, 교착 상태에 빠뜨릴 수 있음
  - 재정의할 수 있는 메소드 호출 금지
  - 클라이언트가 넘겨준 함수 객체 호출 금지
- 동기화 영역에서는 가능한 한 최소한의 일만 정의
  - 락 걸기, 공유 데이터 검사, 수정, 락 풀기 이외 오래걸리는 작업은 동기화 영역 바깥으로 옮겨야 함

```java 
private void notifyElementAdded(E element) {
    synchronized(observers) {
        for (SetObserver<E> observer : oberservers) {
           // 재정의 할 수 있는 객체의 메소드를 호출하면서 예외, 교착 문제가 발생될 수 있다.
           observer.added(this, element);
        }  
    }
}
```

외계인 메소드를 동기화 블록 바깥으로 옮기면 됨

```java 
private void notifyElementAdded(E element) {
    List<SetObserver<E>> snapshot = null;
    synchronized(observers) {
        snapshot = new ArrayList<>(observers);
    }
    for (SetObserver<E> observer : snapshot) {
        observer.added(this, element);
    }
}
```
  
### 가변 클래스 작성 방법 2가지
1. 동기화 전혀하지 말고 사용해야하는 클래스가 외부에서 동기화
   - ex. `java.util`
2. 동기화를 내부에서 수행해 스레드 안전한 클래스
   - 외부에서 객체 전체 락을 거는 것보다 동시성을 월등히 개선할 수 있다면 선택
   - 락 분할, 락 스트라이핑, 비차단 동시성 제어 등의 기법을 동원해 동시성 향상 가능
   - ex. `java.util.concurrent`

