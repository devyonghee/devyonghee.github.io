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


## 출처
- 코틀린 코루틴
