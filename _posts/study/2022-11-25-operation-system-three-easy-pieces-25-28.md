---
title: '[Study] 운영체제 아주 쉬운 세가지 이야기 25장~28장'
tags: [study, book, operation-system]
categories: study
---

운영체제 아주 쉬운 세가지 이야기 책에 대한 스터디를 진행한다.  
이 글에서는 병행성에 대해 다룬 25장부터 28장까지의 내용을 정리한다. 

<!--more-->

## 25장. 병행성에 관한 대화

멀티쓰레드 프로그램에서 각 쓰레드는 독립된 객체로 프로그램을 대신하여 일을 한다.  
쓰레드들은 동시에 메모리에 접근하게 되는데 이를 조정하지 않으면 예상치 못한 문제가 발생될 수 있다. 

### 운영체제와 병행성

- **락(lock)** 과 **컨디션 변수(conditional variable)** 같은 기본 동작으로 멀티 쓰레드 프로그램을 지원해야 함  
- 운영체제 역시 최초의 동시 프로그램 (메모리 영역도 조심스럽게 접근 필요)

<br/>

## 26장. 병행성: 개요

멀티 쓰레드 프로그램은 하나 이상의 실행 지점을 가지고 있다.  
**쓰레드(Thread)** 들은 주소 공간을 공유하기 때문에 동일한 값에 접근할 수 있다.  

쓰레드의 상태는 프로세스와 유사하며, 명령어를 가져오는 프로그램 카운터(PC)와 연산을 위한 레지스터들을 가지고 있다.   
두 쓰레드가 하나의 프로세서에서 실행중이라면 **문맥 교환(context switch)** 를 통해 실행중인 쓰레드와 교체된다.  
여기서 교환되는 상태를 **프로세스 제어 블럭(process control block, PCB)** 에 저장하듯이 **쓰레드 제어 블럭(thread control block, TCB)** 을 사용한다.  
프로세스와 달리 쓰레드간의 문맥 교환은 주소 공간(페이지 테이블)을 그대로 사용한다.  

{% include image.html alt="단일 쓰레드와 멀티 쓰레드의 주소 공간" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/single-multi-thread-address-space.png" %}

멀티 쓰레드 프로세스의 경우, 주소 공간에 쓰레드마다 스택이 할당되어 있다.  
로컬 변수, 매개변수, 리턴 값, 그외 스택에 넣는 것들은 해당 쓰레드의 스택인 **쓰레드-로컬 저장소(thread-local storage)** 에 저장된다.  


### 26.1 왜 쓰레드를 사용하는가?

쓰레드를 사용해야 하는 이유 2가지

- **병렬 처리(parallelism)**
  - 단일 쓰레드(single-threaded) 프로그램을 멀티프로세서 프로그램으로 변환하는 작업을 **병렬화(parallelization)** 라고 함
  - 작업의 일부분을 나눠서 실행하여 실행 속도를 높일 수 있음
- I/O 로 인해 프로그램 실행이 멈추지 않도록 함
  - 하나의 쓰레드가 대기하는 동안 다른 쓰레드로 전환 가능
  - 쓰레딩은 하나의 프로그램 안에서 다른 작업이 중첩(overlap) 될 수 있게 함 (멀티 프로그래밍과 비슷)


### 26.2 예제: 쓰레드 생성

```c
void *mythread(void *arg) {
  printf("%s\n", (char *) arg);
  return NULL;
} 

int
main(int argc, char *argv[]) {
    pthread_t p1, p2;
    int rc;
    printf("main: begin\n");
    Pthread_create(&p1, NULL, mythread, "A");
    Pthread_create(&p2, NULL, mythread, "B");
    // 대기 중인 쓰레드 병합
    Pthread_join(p1, NULL);
    Pthread_join(p2, NULL);
    printf("main: end\n");
    return 0;
}
```

{% include image.html alt="쓰레드 실행 추적" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/thread-creation-code-execute.png" %}

실행 가능 순서는 유일하지 않다.  
다음에 실행될 쓰레드는 **OS 스케줄러(scheduler)** 에 의해 결정된다.  
하지만 어떤 쓰레드가 언제 실행되는지 알기 어렵기 때문에 병행성이 더 어려워진다.  


### 26.3 훨씬 더 어려운 이유: 데이터 공유

각 쓰레드에서 공유 변수에 접근하여 수정하게 된다면 예상치 못한 결과가 나온다.  
예를 들어, 두 쓰레드에서 공유 변수에 +1 하는 과정을 10000번을 반복한다면 20000 이 나오지 않는 문제가 발생한다.  

### 26.4 문제의 핵심: 제어 없는 스케줄링

위 문제처럼 명령어의 실행 순서에 따라 결과가 달라지는 상황을 **경쟁 조건(race condition)** 또는 **데이터 경쟁(data race)** 이라고 한다.  
문맥 교환이 적절하게 실행되지 않으면 잘못된 결과가 나온다.  
이처럼 실행할 때마다 결과가 다른 경우를 **비결정적(indeterminate)** 인 결과라고 한다.

공유 변수를 접근하고 하나 이상의 쓰레드에서 동시에 실행되면 안 되는 코드를 **임계 영역(critical section)** 이라고 한다.    
이러한 코드에서는 **상호 배제(mutual exclusion)** 속성이 필요하다.  
한 쓰레드에서 임계 영역 내의 코드를 실행 중일 때 다른 쓰레드가 실행할 수 없도록 보장하는 것이다.  

### 26.5 원자성에 대한 바람

임계 영역 문제 해결 방법 중 하나로 원자적으로 실행되는 명령어 한개를 수행하여, 수행 도중에 인터럽트 발생 가능성을 차단하는 것이다.
따라서 하드웨어에 **동기화 함수(synchronization primitives)** 구현에 필요한 명령어를 요청한다.    
하드웨어 지원을 사용하고 운영체제의 도움을 받아 하나의 쓰레드만 임계 영역에서 실행해야 한다.  


### 26.6 또 다른 문제: 상대 기다리기

하나의 쓰레드가 다른 쓰레드의 동작이 끝날 때까지 대기해야 하는 상황도 발생한다.  
디스크 I/O 로 요청으로 인해 잠든 경우, I/O 완료 후 쓰레드가 일어나 이후의 작업을 진행하도록 해야 한다.  

### 26.7 정리: 왜 운영체제에서?

운영체제는 최초의 병행 프로그램으로 운영체제 내에서 사용하기 위해 이러한 기법들이 생성되었다.  
멀티 쓰레드 프로그램이 등장하면서 응용 프로그래머들도 비슷한 문제를 고민하게 되었다.  


### 주요 용어

- **임계 영역(critical section)**
  - 변수나 자료 구조와 같은 공유 자원을 접하는 코드의 일부분
- **경쟁 조건(race condition)** 혹은 **데이터 경쟁(data race)**
  - 멀티 쓰레드가 동시에 임계 영역을 실행하려고 할 때 발생
  - 공유 자료 구조에 대해 동시에 접근하면 예상치 못한 결과 발생
- **비결정적(indeterminate)**
  - 프로그램의 실행 결과가 실행할 때마다 다름
- **상호 배제(mutual exclusion)**
  - 임계 영역에 대해 한 번에 하나의 쓰레드만 접근할 수 있도록 보장
  - 경쟁을 피할 수 있고 실행결과를 결정론적으로 얻을 수 있음

## 27장. 막간: 쓰레드 API

쓰레드 API 의 주요 부분을 다룬다.

### 27.1 쓰레드 생성

```c 
int
pthread_create (pthread_t            *thread, 
                const pthread_attr_t *attr,
                void                 *(*start_routine) (void *), 
                void                 *arg);
```

- `thread` 
  - `pthread_t` 타입 구조체를 가리키는 포인터
  - 이 구조체가 쓰레드와 상호작용 
- `attr`
  - 쓰레드의 속성 지정 (스택의 크기와 쓰레드의 스케줄링 우선순위 같은 정보)
  - `NULL` 로 지정하면 기본값 사용 (대부분 기본값으로 충분)
- `start_routine`
  - 쓰레드가 시작할 때 실행할 함수
- `arg`
  - 실행할 함수에게 전달할 인자

### 27.2 쓰레드 종료

쓰레드의 완료를 기다리기 위한 함수 

```c 
int pthread_join (pthread_t thread, void **value_ptr);
```

- `pthread_t thread`
  - 어떤 쓰레드를 기다리는지 명시 (쓰레드 생성 루틴에 의해 초기화)
- `value_ptr`
  - 반환 값에 대한 포인터
  - 전달된 인자의 값을 변경하기 때문에 포인터를 전달

### 27.3 락

쓰레드 라이브러리에서는 **락(lock)** 함수를 통해 임계 영역에 대한 상호 배제 기법을 제공한다. 

```c 
int pthread_mutext_lock(pthread_mutex_t *mutex);
int pthread_mutext_unlock(pthread_mutex_t *mutex);
```

```c 
pthread_mutext_t lock = PTHREAD_MUTEX_INITIALIZER;
// int rc = pthread_mutext_init(&lock, NULL); 이 방식으로도 초기화 가능
pthread_mutext_lock(&lock);
x = x + 1;
pthread_mutext_unlock(&lock);
```

- `pthread_mutext_lock` 가 호출되었을 때 다른 쓰레드도 락을 가지고 있지 않다면 락을 얻어 임계 영역에 진입  
- 다른 쓰레드가 락을 가지고 있으면 락을 얻을 때까지 호출에서 리턴하지 않음
- 락을 획득한 쓰레드가 언락을 호출해야 함
- 락과 언락을 호출할 때 에러 코드 확인 필요

### 27.4 컨디션 변수 

한 쓰레드가 계속 진행하기 전에 다른 쓰레드가 작업을 기다리는 일종의 쓰레드 간에 시그널 교환할 수 있는 **컨디션 변수(condition variable)** 을 제공한다.  

```c 
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mutex);
int pthread_cond_signal(pthread_cond_t *cond);
```

`pthread_cond_wait` 는 호출 쓰레드를 수면(sleep) 상태로 만들고 다른 쓰레드로부터 시그널을 대기한다.
수면중인 쓰레드가 관심있는 사항이 변경되면 시그널을 보낸다.

또한, 컨디션 변수를 사용하려면 연결된 락이 반드시 필요하다.

```c
pthread_mutext_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;
Pthread_mutex_lock(&lock);
while (ready == 0) {
    Pthread_cond_wait(&cond, &lock);
}
Pthread_mutex_unlock(&lock);
```

- 시그널을 보내고 전역 변수 `ready` 를 수정할 때 락을 가지고 있어야 함
- 시그널 보내기 함수에서는 조건만을 인자로 받는 것에 유의해야 함
- 대기하는 쓰레드가 조건을 검사할 때 `if` 대신 `while` 문 사용해야 함


### 27.5 컴파일과 실행 

`-pthread` 플래그를 추가하여 pthread 라이브러리와 링크해야 함

```text
prompt> gcc -o main main.c -Wall -pthread
```

<br/>

## 28장. 락

**락(lock)** 을 이용하여 병행 프로그램의 근본적인 문제를 다룬다.  
임계 영역을 락으로 둘러서 하나의 원자 단위 명령어인 것처럼 실행되도록 한다.  


### 28.1 락: 기본 개념

락은 일종의 변수로 사용하기 위해 락 변수를 먼저 선언해야 한다.  
두 개의 상태가 있는데 **사용가능 상태(available, unlocked, free)** 상태와 **사용 중(acquired)** 상태가 존재한다.  
`lock()` 루틴 호출을 통해 락 획득을 시도하고, `unlock()` 호출을 하면 락은 다시 사용 가능한 상태로 된다.

락을 획득한 쓰레드는 락 **소유자(owner)** 라고 한다.

### 28.2 Pthread 락

쓰레드 간에 **상호 배제(mutual exclusion)** 기능을 제공하기 때문에 POSIX 라이브러리는 락을 **mutex** 라고 한다.  

```c 
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
Phtread_mutex_lock(&lock);
balance = balance + 1;
Pthread_mutex_unlock(&lock);
```

다른 변수를 보호하기 위해 다른 락을 사용할 수도 있다.  
하나의 락으로 모든 임계 영역들을 보호하는 것은 **coarse-grained** 락 사용 전략,  
다수의 쓰레드가 서로 다른 락으로 보호된 코드를 실행하는 것은 **미세(fine-grained)** 락 사용 전략이라고 한다. 

### 28.3 락의 구현

사용 가능한 락을 만들기 위해서는 하드웨어와 운영체제 도움이 필요하다.  

### 28.4 락의 평가

락 설계시, 정상동작 여부 판단을 위해 판단 기준이 필요하다.  

- **상호 배제** 를 제대로 지원하는가 
  - 임계 영역 내로 다수의 쓰레드가 진입을 막을 수 있는가 
- **공정성(fairness)**
  - 락 획득에 대한 공정한 기회가 주어지는가
  - 락을 획득하지 못하는 굶주리는(starve) 경우가 발생하는가
- **성능(performance)**
  - 경쟁이 전혀 없는 경우의 성능
  - 단일 CPU 상에서 락을 획득하려고 경쟁할 때 성능
  - 멀티 CPU 상황에서 락 경쟁 시의 성능

### 28.5 인터럽트 제어 

초창기 단일 프로세스 시스템에서는 임계 영역 내에서는 인터럽트를 비활성화화여 상호 배제를 지원했다.

```c 
void lock() {
    DisableInterrupts();
}
void unlock() {
    EnableInterrupts();
}
```

#### 장점

- 단순

#### 단점

- 쓰레드가 인터럽트를 활성/비활성화하는 **특권(privileged)** 연산을 실행할 수 있도록 허가 필요
  - 악의적인 프로그램이 독점하거나 무한 반복문에 빠질 수 있음 
- 멀티프로세서에서 적용 불가능
  - 특정 프로세서의 인터럽트 비활성화는 다른 프로세서에 영향을 주지 않음 (임계 영역 진입 가능)
- 장시간동안 인터럽트를 중지하면 중요한 시점을 놓칠 수 있음
- 최신의 CPU 들에서는 느리게 실행되는 경향이 있음

### 28.6 실패한 시도: 오직 load/store 명령어만 사용하기

load/store 명령어만으로는 락의 구현이 불가능하다. 

- 상호 배제 제공 실패 
  - 적시에 인터럽트가 발생하면 두 쓰레드 모두 플래그가 예상치 못한 값으로 설정되어 임계 영역에 두 쓰레드가 진입 가능 
- 성능 저하  
  - 다른 쓰레드가 락을 해제할 때까지 시낭 낭비


### 28.7 Test-And-Set 을 사용하여 작동하는 스핀 락 구현하기

**test-and-set** 명령어 또는 **원자적 교체(atomic exchange)** 명령어가 락 지원을 위한 하드웨어 기법 중 가장 기본이다.  

```c 
int TestAndSet(int *old_ptr, int new) {
    int old = *old_ptr;  // old_ptr 의 이전 값 가져옴
    *old_ptr = new;      // old_ptr 에 new 값 설정
    return old;
}
```

`TestAndSet` 명령어는 이전 값을 **검사(test)** 하면서 메모리에 새로운 값을 **설정(set)** 하기 때문에 원자적으로 수행된다.  
이 명령어만으로 **스핀 락(spin lock)** 을 만들 수 있다.  
스핀 락은 가장 기초적인 형태의 락으로, 락을 획득할 때까지 CPU 사이클을 소모하면서 회전한다.

```c 
void lock(lock_t *lock) {
    while (TestAndSet(&lock->flag, 1) == 1)
        ; //do nothing
}
void unlcok(lock_t *lock) {
    lock->flag = 0;
}
```

### 28.8 스핀 락 평가

- 상호 배제의 정확성
  - 임의의 시간에 단 하나의 쓰레드만이 임계 영역에 진입할 수 있음
- 공정성 보장하지 못함
  - `while` 문을 회전 중인 쓰레드는 경쟁에 밀려 그 상태에 남아있을 수 있음
- 성능
  - 단일 CPU 의 경우 오버헤드가 클 수 있음 (CPU 사이클 낭비)
  - 다중 CPU 의 경우 합리적으로 동작 (다른 CPU 에서 대기)


### 28.9 Compare-And-Swap

다른 하드웨어 기법으로는 SPARC 의 **Compare-And-Swap**, x86 에서는 **Compare-And-Exchange** 가 있다.

```c 
int CompareAndSwap(int *ptr, int expected, int new) {
    int original = *ptr;
    if (original == expected)
        *ptr = new;
    return original;
}
```

이 기법은 `ptr` 이 가리키고 있는 주소의 값이 `extected` 변수와 일치하는지 검사하는 것이다.  
**Compare-And-Swap** 명령어는 `TestAndSet` 명령어보다 더 강력하고 **대기 없는 동기화(wait-free synchronization)** 를 제공한다. 


### 28.10 Load-Linked 그리고 Store-Conditional

MIPS 구조에서는 **load-linked** 와 **store-conditional** 명령어를 사용하여 락이나 병행 연산을 위한 자료구조를 만들 수 있다.  

```c 
int LoadLinked(int *ptr) {
    return *ptr;
}
int StoreConditional(int *ptr, int value) {
    if (no updat to * ptr since the LoadLinked to this address) {
        *ptr = value;
        return 1;  // 성공
    } else {
        return 0;  // 갱신 실패
    }
}

void lock(lock_t *lock) {
    while (LoadLinked(&lock->flag) || !StoreConditional(&lock->flag, 1))
        ; // 회전
}
```

### 28.11 Fetch-And-Add

이 기법은 Fetch-And-Add 명령어로 원자적으로 특정 주소의 예전 값을 반환하면서 값을 증가시킨다.   
모든 쓰레드들이 각자의 순서에 따라 진행

```c 
int FetchAndAdd(int *ptr) {
    int old = *ptr;
    *ptr = old + 1;
    return old;
}
```

### 28.12 요약: 과도한 스핀

위에서 소개한 하드웨어 기반의 락은 간단하고 잘 동작한다.  
하지만 쓰레드가 스핀 구문을 실행하면서 변경되기를 기다리며 시간을 낭비한다.  
쓰레드가 경쟁하게 되면 상황은 더 심해진다.  

### 28.13 간단한 접근법: 조건 없는 양보!

다른 쓰레드에서 락을 획득한 상태라서 스핀만 무한히 하는 경우에 대한 해결책 알아본다.   
락이 해제되기를 기다려야 할 경우 CPU 를 다른 쓰레드에게 양보하는 것이다.  

```c
void lock(lock_t *lock) {
    while (TestAndSet(&flag, 1) == 1)
        yield();  // 다른 쓰레드에게 CPU 양보
}
```

쓰레드는 실행중(running), 준비(ready), 막힘(blocked) 세 가지 상태가 있다.  
**양보(yield)** 시스템 콜은 실행 중(running) 상태에서 준비(ready) 상태로 변환하여 다른 쓰레드가 실행 중 상태로 전이하도록 한다.  
하지만 이 기법은 문맥 교환 비용이 상당하며 낭비가 많다.   

### 28.14 큐의 사용: 스핀 대신 잠자기

다수의 쓰레드가 대기하는 경우 명시적으로 쓰레드를 선택할 수 있도록 운영체제의 지원과 큐를 이용한 대기 쓰레드 관리가 필요하다.  
Solaris 방식에서는 쓰레드를 잠재우는 `park()`, 깨우는 `unpark(threadID)` 함수가 있다.  

락 대기자 전용 큐를 사용하여 락을 더 효율적이고 기아 현상을 피할 수 있도록 구현한다.  
이 방식은 스핀 대기 시간이 상당히 짧아 오버헤드가 작다. 

하지만 쓰레드가 `park()` 호출 직전에 다른 쓰레드에서 락을 해제하면 블럭 상태(**wakeup/waiting race** 문제)가 되기 때문에 경쟁 조건이 발생할 수 있다.    
이 문제는 `setpark()` 를 추가하면서 해결했다. 

```c 
void lock(lock_t *m) {
    while (TestAndSet(&m->guard, 1) == 1) 
        ; // 회전하면서 guard 락 획득
    if (m->flag == 0) {
        m->flag = 1;  // 락 획득
        m->guard = 0;
    } else {
        queue_add(m->q, gettid());
        m->guard = 0;
        park();
    }
}

void unlock(lock_t *m) {
    while (TestAndSet(&m->guard, 1) == 1)
        ; // 회전하면서 guard 락 획득
    if (queue_empty(m->q)) 
         m->flag = 0; // 락 포기
    else
        unpark(queue_remove(m->q));  // 락 획득
    m->guard = 0;
}
```

### 28.15 다른 운영체제, 다른 지원

Linux 의 경우 **futex** 를 지원한다.   
futex 는 특정 물리 메모리 주소 그리고 커널에 정의된 큐를 갖고 있다.
쓰레드를 블럭시키는 `futex_wait(address, expected)` , 큐에서 대기하고 있는 쓰레드를 깨우는 `futext_wake(address)` 명령어가 존재한다. 


### 28.16 2단계 락

Linux의 락은 **2단계(two-phase lock)** 이라고 불린다.  
첫 번째 단계에서는 회전하며 대기하고, 획득하지 못했다면 두 번째 단계에서 호출자는 차단된다.  
락 해제시 블럭된 쓰레드중 하나를 깨웩 된다.
