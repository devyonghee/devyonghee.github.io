---
title: '[Modern Java in Action] Chapter16. CompletableFuture: 안정적 비동기 프로그래밍'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 16장에서는 비동기 프로그래밍에 대해 소개하고 있다.     
실용적인 예제를 통해 `CompletableFuture`이 얼마나 비동기 프로그램에 유용하게 사용되는지 알아본다. 

<!--more-->

<br/>

## 16.1 Future 의 단순 활용

`Future`는 저수준 스레드에 비해 직관적으로 이해하기 쉽다.  
`Future`를 이용하기 위해서는 `Callable` 객체 내부로 감싸고 `ExecutorService` 에 제출해야 한다.

```java 
ExecutorService executor = Executors.newCachedThreadPool();
Future<Double> future = executor.submit(new Callable<Double>() {
    public Double call() {
        // 시간이 오래걸리는 작업은 다른 스레드에서 비동기로 실행
        return doSomeLongComputation();
    }
});

doSomethingElse(); // 비동기 작업을 수행하는 동안 다른 작업 실행

try {
    // 오랜 시간 블락될 수 있으므로 최대 1초 동안 비동기 작업 결과를 가져옴
    Double result = future.get(1, TimeUnit.SECONDS);  
} catch (ExecutionException ee) {
    // 계산 중 예외 발생
} catch (InterruptedException ie) {
    // 현재 스레드에서 대기 중 인터럽트 발생
} catch (ExecutionException ee) {
    // Future가 완료되기 전에 타임아웃 발생
}
```

### Future 제한

`Future` 만으로 간결한 동시 실행 코드를 구현하는 것은 쉽지 않다.  
다음과 같은 선언형 기능들이 있다면 유용할 것이다.  

- 두 개의 비동기 계산 결과를 하나로 합친다.
  - 두 가지 계산 결과는 서로 독립적일 수 있음
  - 두 번째 결과가 첫 번째 결과에 의존하는 상황일 수 있음
- Future 집합이 실행하는 모든 태스크의 완료를 기다린다.
- Future 집합에서 가장 빨리 완료되는 태스크를 기다렸다가 결과를 얻는다.
- 프로그램적으로 Future 를 완료시킨다. (비동기 동작에 수동으로 결과 제공)
- Future 완료 동작에 반응한다. 
  - 결과를 기다리면서 블록되지 않고 결과가 준비되었다는 알림을 받고 추가 동작 수행

이러한 기능을 선언형으로 사용할 수 있도록 `CompletableFuture` 를 살펴본다.  
`Stream`과 비슷한 패턴으로 람다 표현식과 파이프라이닝을 활용한다. 

> ### 동기 API 와 비동기 API
> 동기 API: 메서드를 호출하고 계산이 완료될 때까지 기다렸다가 다른 동작 수행 (블록 호출)  
> 비동기 API: 메서드가 즉시 반환되며 나머지 작업을 호출자 스레드와 동기적으로 실행될 수 있도록 다른 스레드에 할당 (비블록 호출)

