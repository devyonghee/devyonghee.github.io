---
title: '[코틀린 코루틴] 코틀린 코루틴 학습하기'
tags: [book, kotlin, coroutine]
categories: book
---

코틀린으로 더 효율적으로 로직을 처리할 수 있도록 코틀린 코루틴에 대해 알아본다.

<!--more-->

<br/>

## 코틀린 코루틴 라이브러리

프로젝트에서 사용하기 위해 다음 의존성 추가 필요

```
implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core")
```

- 모든 코루틴 빌더는 `CoroutineScope` 에서 시작되어야 함
  - `GlobalScope` 객체에서 호출도 가능하지만 현업세서는 사용 지양
  - 중단 함수에서 스코프 처리는 `coroutineScope` 함수 사용이 바람직함

### 코루틴 스코프 함수

**코루틴 빌더 vs 코루틴 스코프 함수**

| 코루틴 빌더                          | 코루틴 스코프 함수                                                |
|---------------------------------|-----------------------------------------------------------|
| launch, async, produce          | coroutineScope, supervisorScope, withContext, withTimeout |
| CoroutineScope 확장 함수            | 중단 함수                                                     |
| CoroutineScope 리시버의 코루틴 컨텍스트 사용 | 중단 함수의 컨티뉴에이션 객체가 가진 코루틴 컨텍스트 사용                          |
| 예외는 Job 을 통해 부모로 전파             | 일반 함수와 같은 방식으로 예외 던짐                                      |
| 비동기인 코루틴 시작                     | 코루틴 빌더가 호출된 곳에서 코루틴 시작                                    |

- `coroutineScope`
  - 스코프를 시작하는 중단 함수
  - 부모로부터 컨텍스트를 상속받음
  - 자신의 작업을 끝내기 전까지 모든 자식을 기다림
  - 새로운 코루틴을 생성하지만 새로운 코루틴이 끝날 때까지 대기
    - 작업을 동시에 시작하지 않음
- `withContext`
  - `coroutineScope` 와 다르게 스코프의 컨텍스트 변경 가능
- `supervisorScope`
  - `coroutineScope` 와 다르게 `Job` 을 `SupervisorJob` 으로 오버라이딩하기 때문에 자식 코루틴이 예외를 던지더라도 취소되지 않음
  - `withContext(SupervisorJob())` 은 여전히 자식들 또한 취소가 되므로 대신 사용될 순 없음 
- `withTimeout`
  - 실행하는 람다식의 시간 제한이 있음 (시간 제한이 매우 크다면 `coroutineScope` 와 동일)
  - 테스트하는 경우 유용
  - `CancellationException` 의 서브타입인 `TimeoutCancellationException` 을 던짐
  - 타임아웃이 초과되면 예외 대신 `null` 을 반환하는 함수 `withTimeoutOrNull` 도 있음 

### 코루틴 빌더
- `luanch`
  - 호출되자마자 즉시 코루틴 실행
  - 값이 필요하지 않은 경우 사용
  - `thread` 함수를 호출하여 새로운 스레드를 시작하는 것과 비슷  
  - 데몬 스레드와 비슷하게 동작하지만 훨씬 가벼움
    - 백그라운드에서 실행되며 프로그램 끝나는 걸 막지 않음
- `runBlocking`
  - 스레드를 중단 시킴
    - 프로그램이 끝나는 걸 방지하기 위해 블로킹할 필요가 있는 메인 함수에서 사용
      - 요즘에는 `suspend` 를 붙여 중단 함수로 만드는 방법 주로 사용  
    - 블로킹이 필요한 유닛 테스트에서 주로 사용
      - 요즘에는 가상 시간으로 실행시키는 `runTest` 가 주로 사용됨
  - 다른 코루틴 빌더와 다르게 루트 코루틴으로만 사용 가능 (모든 자식의 부모)
- `async`
  - 호출되자마자 즉시 코루틴 실행
  - `launch` 와 다르게 값을 생성하도록 설계되어 있음


### CoroutineContext 인터페이스

- 원소나 원소들의 집합을 나타내는 인터페이스 (컬렉션 개념과 비슷)
- 코틀린에서 대괄호(`[]`)를 사용하여 키에 해당되는 원소 찾기 가능(없으면 `null`)
- 부모 컨텍스트는 기본적으로 자식 컨텍스트에게 전달
- 중단함수에서는 `coroutineContext` 을 통해 접근 가능
- 개별적으로 생성하기 위해서는 `CoroutineConext.Element` 를 구현하고 컴패니언 객체를 키로 사용

### Job

Job 은 수명을 가지고 있으며 취소 가능한 컨텍스트

**Job 상태**

| 상태                   | isActive | isCompleted | isCanceled |
|----------------------|----------|-------------|------------|
| New (지연 시작될 때 시작 상태) | false    | false       | false      |
| Active (시작 상태 기본값)   | true     | false       | false      |
| Completing (일시적인 상태) | true     | false       | false      |
| Cancelling (일시적인 상태) | false    | false       | true       |
| Cancelled (최종상태)     | false    | true        | true       |
| Completed (최종 상태)    | false    | true        | false      |

- `launch` 의 반환 타입 `Job`
- `async` 의 반환 타입은 `Job` 인터페이스를 구현한 `Deffered<T>`
- `Job` 은 코루틴 컨텍스트로 `coroutineCotext[Job]` 또는 확장 프로퍼티(`CoroutineContext.job`) 로 접근 가능
- `join` 메서드를 사용하여 마지막 상태 도달까지 기다릴 수 있음
- `Job()` 팩토리 함수를 통해 생성 가능 
  - `CompleteableJob` 타입 반환
    - `complete(): Boolean` - 잡을 완료하는 데 사용, 호출하면 새로운 코루틴 시작 불가
    - `completeExceptionally(exception: Throwble): Boolean` - 인자로 받은 예외로 잡을 완료 시킴
- 취소 기능 (`cacnel` 메서드)
  - 호출한 코루틴은 첫 번째 중단점에서 잡을 끝냄
  - 자식 잡도 같이 취소 되며 부모는 영향을 받지 않음
  - 잡이 취소되면 `Cancelling` 되었다가 `Cancelled` 상태로 변경
  - `join` 을 호출하지 않으면 경쟁 상태가 될 수 있음 (이러한 이유로 `cancelAndJoin` 확장함수 제공)
  - 취소된 이후 중단 함수 호출이 필요한 경우(ex. 데이터베이스 롤백) `withContext` 사용
  - 취소된 이후 자원 해제를 위해서는 `invokeOnCompletion` 메서드 호출
  - 중단점이 없는데 CPU, 시간 집약적인 연산이 있는 경우
    - 연산 사이에 `yield` 호출
    - 잡의 상태를 확인하여 연산 중단 (`isActive` 프로퍼티 사용 또는 `ensureActive()` 호출)
   
### 디스패처

- 디스패처를 설정하지 않으면 `Dispatchers.Default`
  - 코드가 실행되는 컴퓨터의 CPU 개수와 동일한 수의 스레드 풀을 가짐
  - 같은 시간에 특정 수 이상의 스레드 사용을 제한하고 싶다면 `Dispatchers.Default.limitedParallelism` 메서드 사용
- 메인 스레드에서 코루틴을 실행하려면 `Dispatchers.Main`
  - 단위 테스트에서 메인 디스패처를 정의해서 사용하고 싶다면 `Dispatchers.setMain(dispatcher)` 으로 정의
- 파일을 읽고 쓰는 경우, 블로킹 함수를 호출하는 경우 같이 I/O 연산으로 블로킹할 때 `Dispatchers.IO` 사용
  - 같은 시간에 50개가 넘는 스레드 사용 가능
- 정해진 수의 스레드 풀을 가진 디스패처
  - `Executors.newFixedThreadPool(NUMBER).asCoroutineDispatcher()`
- 싱글스레드로 제한된 디스패처
  - 하나의 스레드만 가지고 있어서 작업이 순차적으로 처리
  - 선언 방법
    - `Executors.newSingleThreadExecutor().asCoroutineDispatcher()`
      - 스레드 하나를 액티브한 상태로 유지해야 함
      - 더 이상 사용되지 않을 때는 스레드를 반드시 닫아야 함
    - `Dispatchers.Default.limitedParallelism(1)`
      - 최근에 사용하는 방식

## 출처
- 코틀린 코루틴
