---
title: 프로세스(Process) 와 스레드(Thread)
tags: [process, thread]
categories: theory
---

Proces와 Thread 의 차이는 기술 면접에서 자주 나오는 질문입니다.  
두 개념의 차이에 대해서 자세하게 알아보도록 하겠습니다.
    
<!--more-->


## 프로세스(Process) 란

프로세스에 대해 알아보기 전에 우선 프로그램에 대해 먼저 알아보자면, 
**프로그램**은 **어떤 작업을 하기 위해 실행할 수 있는 파일** 로 정적인 개념입니다.

**프로세스**는 **프로그램이 메모리에 적재 되어 실행되고 있는 인스턴스**를 의미합니다. 
즉, 운영체제로부터 시스템 자원을 할당받는 작업의 단위로 연속적으로 실행되고 있는 프로그램입니다.


### 프로세스 상태

{% include image.html alt='프로세스 상태 출처: [geeksforgeeks](https://www.geeksforgeeks.org/states-of-a-process-in-operating-systems/) ' path="images/theory/process-vs-thread/process-state.png" %}

#### Created or New

프로세스가 처음 생성될 때의 상태입니다. 

'Created' 상태에서는 'ready' or 'waiting' 상태가 되는 것을 기다리고 있습니다.
이 상태 변경은 시스템에서 승인을 받아야 가능하지만, 대부분의 시스템에서는 자동으로 승인됩니다. 
하지만 **실시간 운영 체제**에서 너무 많은 프로세스를 'ready' 상태를 허용하면 시스템 **리소스가 과포화**될 수 있기 때문에 승인이 지연될 수 있습니다.


#### Ready or Waiting

프로세스가 주 메모리에 로드되고 CPU에서 실행을 기다리는 상태입니다.

최근 컴퓨터에서는 동시에 많은 프로그램을 실행할 수 있습니다. 
하지만 하나의 CPU에서는 하나의 프로세스만 처리할 수 있기 때문에 
다른 프로세스들은 'ready' 상태로 'ready queue' or 'run queue' 에 보관됩니다. 
보관된 대기열들은 컴퓨터 스케줄러에 의해 CPU로 **context switch** 되면서 실행됩니다.


#### Running

프로세스가 선택되어 실행되고 있는 상태입니다. 

CPU 당 최대 하나의 프로세스만 실행될 수 있으며, 
프로세스는 **커널 모드**와 **사용자 모드** 두가지 모드로 실행될 수 있습니다.

{% include image.html alt="유저 모드 커널 모드 (출처: microsoft)" path="images/theory/process-vs-thread/user-mode-kernel-mode.png" %}

커널 모드(kernel mode)
- 시스템의 모든 메모리에 접근 가능
- 하드웨어에 대한 무제한 액세스를 허용
- 다양한 명령어에는 권한이 있고 커널 모드에서만 실행될 수 있음
- 단일 주소 공간을 공유, 커널 모드에서 다른 가상 주소를 수정한다면 운영체제 또는 다른 프로세스가 손상 될 수 있음


사용자 모드(User mode)
- 자신의 명령과 데이터에 액세스할 수 있지만, 커널 명령과 데이터에 액세스 불가능
- 하드웨어 장치에 대해 직접 액세스 불가능
- 각 프로세스에 대해 격리된 가상 주소 공간 존재 
- 다른 프로세스에 영향이 없도록 격리된 프로세스 실행 보장
- 시스템 호출을 통해 운영 체제에 서비스 요청하면 유저모드에서 커널 모드로 전환
- CPU 유저 모드 특권 수준으로 코드 실행

#### Blocked

실행되다가 할당 받은 CPU를 반납한 상태

입/출력 또는 특별한 이벤트가 발생될 때까지 수행될 수 없고 기다리는 상태입니다. 
데이터가 오면 프로세스가 ready 상태로 되고 스케줄러에게 다시 실행될 수 있다고 알리게 됩니다.

#### Terminated

프로세스 실행이 완료되거나 종료된 상태

프로세스는 더 이상 실행되지는 않지만, 
부모 프로세스가 종료된 상태를 인지하고 시스템을 호출하기 전까지 좀비 프로세스로 남아있습니다. 
만약, 여기서 부모 프로세스가 시스템 호출에 실패하게 된다면 메모리 누수가 발생됩니다.

완전히 종료되고나면 프로세스는 메모리에서 제거되고 
PCB (Process Control Block) 이 소멸됩니다.


#### Suspended

프로세스 수행이 중단된 상태입니다.  

외부적인 이유로 정지되고 보조 메모리에 swap 이 발생됩니다. 
Ready, Blocked 은 CPU에서의 상태로 실제 프로세스의 작업은 수행되고 있지만, 
Suspended는 프로세스 수행이 완전 정지된 상태입니다.

- Swapped out and ready or Suspended ready
  - ready 상태에서 메모리 부족으로 중단되고 보조 메모리에 배치된 상태입니다.
  - 프로세스는 다시 메인 메모리로 가져올 때 ready 상태로 전환될 수 있습니다.

- Swapped out and blocked or Suspended blocked
  - blocked 상태에서 메모리 부족으로 중단되고 보조 메모리에 배치된 상태입니다. 
  - 프로세스는 다시 메인 메모리로 가져올 때 blocked 상태로 전환될 수 있습니다.
  - 작업이 완료된 이벤트를 받으면 suspended blocked 상태에서 suspended waiting 상태로 전활될 수 있습니다. 

### 프로세스 제어 블록 (PCB: Process Control Block)

프로세스 제어 블록 (PCB, Process Control Block)은  운영체제가 프로세스를 제어하기 위해 정보를 저장하는 자료구조입니다. 
프로세스가 생성될 때마다, 자신만의 고유한 PCB 가 함께 생성되고 프로세스가 종료되거나 완료되면 같이 제거됩니다.

하나의 프로세스가 CPU를 점유하고 작업 도중 중간에 다른 프로세스가 실행되어야 할 수 있습니다. 
그러면, 기존 프로세스는 작업하던 내용을 정리하고 CPU 를 반환해야 됩니다. 
이때 작업하고 있던 내용들을 저장하고 있어야 다음에 어떤 작업을 해야하는지 알 수 있습니다. 

여기서 관련 정보가 저장되는 공간이 PCB이고, 
현재 진행중인 작업의 상태를 저장하고 다른 작업의 상태를 읽고 처리하는 과정을 Context Switching 이라고 합니다.

운영체제 종류에 따라 PCB 에 저장되는 내용은 다를 수 있지만, 일반적으로 다음의 정보들을 포함하고 있습니다.

{% include image.html alt="Process Control Block (출처: [geeksforgeeks](https://www.geeksforgeeks.org/process-table-and-process-control-block-pcb/))" path="images/theory/process-vs-thread/process-control-block.png" %}

#### Pointer

프로세스의 현재 위치를 유지하기 위한 정보를 저장합니다.  
부모/자식 프로세스에 대한 포인터, 자원에 대한 포인터 등의 정보가 있습니다.  

#### Process state

ready, running, blocked 등 프로세스 상태에 대한 정보를 저장합니다.

####Process number (PID)

프로세스를 구별할 수 있는 식별자 정보를 저장합니다.  
모든 프로세스는 프로세스를 구별할 수 있는 PID라는 고유 ID가 부여됩니다.

#### Program counter

다음에 실행할 명령어의 주소에 대한 포인터 정보를 저장합니다.

#### Register

프로세스가 실행되기 위해 필요한 
Accumulator, CPU Register, General Register 등 레지스터 정보를 저장합니다.

#### Memory Management Information

운영체제에서 사용하는 메모리 관리 시스템에 대한 정보를 저장합니다.  
page table, memory limits, segment table 등이 포함될 수 있습니다. 

#### Open files list or I/O Status Information

프로세스가 현재 사용중인 파일 및 장치에 대한 포인터를 저장합니다.

#### Accounting Information

프로세스 실행에 사용된 CPU 크기, 시간 제한, 실행 ID 에 대한 정보를 저장합니다. 


### 프로세스 메모리 구조

프로세스는 프로그램이 메모리에 적재되고 실행된 인스턴스를 의미한다.  
어떻게 메모리에 적재되는 것인지 그 구조에 대해 자세하게 알아보겠다.

{% include image.html alt="process memory" path="images/theory/process-vs-thread/process-memory.png" %}

프로세스의 주소 공간은 크게 코드(code), 데이터(data), 스택(stack), 힙(heap) 영역으로 나누어진다.  
여기에 데이터 영역에 BSS(Block Started by Symbol) 영역도 추가될 수 있다.  

{% include image.html alt="process memory structure" path="images/theory/process-vs-thread/process-memory-structure.png" %}

각 영역에는 위와 같은 정보들이 저장되고 있는데 
아래에 영역별로 자세하게 살펴보도록 하겠다. 

#### 코드(code) 영역

코드를 실행하기 위해 저장되는 영역  

프로그램을 실행시키기 위한 명령문들이 저장되어 있다.  
제어문, 함수, 상수 등의 코드가 CPU 에서 수행할 수 있는 기계어 명령 형태로 변환되어 저장된다.  
컴파일 타임에 결정되고 중간에 코드가 변경될 수 없도록 Read Only 상태이다.

#### 데이터(data) 영역

전역변수(global), 정적변수(static), 배열(array), 구조체(structure) 등 프로그램이 사용하는 데이터가 저장되는 영역

프로그램이 실행될 때 생성되고, 프로그램이 종료되면 반환된다.  
런타임 중에도 값이 변경될 수 있기 때문에 Read Write 상태로 되어 있다.

데이터 영역은 다시 초기화된 변수 영역(initialized data segment), 초기화되지 않은 변수 영역(uninitialized data segment) 두가지로 나누어질 수 있다.  
초기화된 변수 영역은 data 영역, 초기화되지 않은 변수 영역은 BSS(Block Started by Symbol) 영역에 저장된다.


#### 스택(stack) 영역

호출된 함수가 실행되면서 지역변수, 매개변수, 리턴 값 등의 데이터가 저장되는 영역

함수가 호출될 때 생성되고 수행 완료되면 시스템에 반환되는 임시 메모리 영역이다.  
LIFO(Last In First Out) 방식을 따르며, 컴파일 타임에 크기가 결정된다.  
무한히 할당될 수 없기 때문에 재귀함수가 깊어지거나 변수가 많이 사용되어 메모리를 초과하면 stack overflow 가 발생된다.

#### 힙(heap) 영역

사용자가 필요할 때마다 사용하는 동적 할당 메모리 영역  

다른 영역과 다르게 Heap 영역은 런타임에 결정되며, 프로세스 도중 변경이 가능하다.  
자바에서는 `new` 연산자로 생성하는 경우 이 영역에 저장되고, GC(garbage collector)에 의해 정리된다.
하지만 해제가 정상적으로 이루어지지 않는다면 메모리 누수가 발생될 수 있으니 주의해야 한다. 

스택에 비해 메모리 공간을 많이 사용할 수 있지만 비교적으로 느리다. 


## 스레드(Thread)

{% include image.html alt="스레드 (출처: wikipedia) " path="images/theory/process-vs-thread/thread.png" %}

스레드란 프로세스 내에서 실행되는 작업 흐름의 단위다.  
일반적으로 한 프로세스에는 메인 스레드 하나만 가지고 있지만, 
프로그램 환경에 따라 멀티 스레드 방식을 지원할 수 있다.

{% include image.html alt="스레드 메모리" path="images/theory/process-vs-thread/thread-memory.png" %}

각 프로세스에서는 코드, 데이터, 스택, 힙 영역이 존재한다.  
스레드는 독립적인 작업을 위해 각각 스택과 PC 레지스터 값을 갖고 코드, 데이터, 힙 영역은 공유하게 된다.

### 스레드 상태(state) 및 생명주기(life cycle)

자바에서 기본적으로 스레드 기반으로 동작하기 때문에, 자바 기준으로 스레드 상태에 대해 자세히 알아보겠다.  
자바에서 스레드의 생명주기는 JVM(Java Virtual Machine)에 의해 기록되고 관리된다.  
스레드의 상태는 `java.lang.Thread` 내부에 `enum State` 으로 6가지가 선언되어 있다. 

{% include image.html alt="스레드 (출처: wikipedia) " path="images/theory/process-vs-thread/thread.png" %}

#### NEW

스레드 객체가 생성된 상태  
실행(`start()`)되지 않은 상태로 대기열 큐에도 올라가지 않는다.

#### RUNNABLE

실행 준비 또는 실행 중인 상태    
`start()` 가 호출 되면 실행을 대기하고 있다가, 
`run()` 이 호출되면 CPU를 점유하고 작업을 수행(running)하게 된다.  
이 상태는 Runnable pool 에 모여있다.

#### WAITING

실행 대기중인 상태
`wait()`, `join()` 등의 메소드를 통해 일시정지된 상태로,
다른 스레드에서 `nofity()` 또는 `nofityAll()` 호출을 기다린다.

#### TIMED_WATING

주어진 시간동안 일시 정지된 상태  
`sleep(n)` 메서드로 최대 대기 시간을 명시한다.  
외부적인 변화 뿐만 아니라 시간이 지나면 `RUNNABLE` 상태로 된다.

#### BLOCK
동기화를 위해 lock 이 걸려 일시정지된 상태   
동기화 대상 인스턴스의 lock 을 획득하기 위해 대기한다.  
이미 다른 스레드가 소유하고 있다면 해당 모니터의 EntrySet(lock-Pool) 에서 대기하게 된다.

#### TERMINATED
모든 처리가 완료됐거나, 강제 종료된 상태  
종료된 스레드는 다시 `start()` 로 실행할 수 없다.  
스레드를 종료할 때, `stop()` 메소드를 이용하여 강제 종료하면 자원들이 불안정해질 수 있기 때문에 
`interrupt()` 메소드로 안전하게 종료해야 한다. 


### 스레드 제어 블록 (TCB: Thread Control Block)

{% include image.html alt="스레드" path="images/theory/process-vs-thread/tcb-pcb.png" %}

Process 가 PCB(Process Control Block)를 가지는 것처럼 스레드도 TCB(Thread Control Block) 를 가진다.  
TCB는 스레드 별로 존재하고 있으며 PCB 를 가리키는 정보를 함께 포함하고 있다.  

프로세스에 있는 스레드 라이브러리에 의해 스케줄링이 되며,  
이 스레드의 정보를 통해 Context Switching 이 일어난다. 

{% include image.html alt="TCB (출처: https://www.geeksforgeeks.org/thread-control-block-in-operating-system/)" path="images/theory/process-vs-thread/thread-control-block.png" %}

#### Thread ID

스레드가 생성될 때 운영 체제에서 스레드에 할당하는 고유 식별자

#### Thread states

스레드가 작업을 진행하면서 변경된 스레드의 상태

#### CPU information

스레드가 얼마나 진행되었는지, 어떤 데이터가 사용되고 있는지 OS 에서 작업하기 위해 필요한 정보 

- program counter
  - 현재 프로그램 명령을 가리킴

- register contents 
  - 스레드의 레지스터 값

#### Thread Priority

스레드 스케줄러가 READY 큐에서 다음 스레드 작업을 선택하기 위한 스레드 우선 순위 정보

#### Pointer

프로세스를 가리키면, 이 스레드를 생성한 프로세스를 가리키는 포인터   
스레드를 가리키면, 이 스레드에 의해 생성된 스레드를 가리키는 포인터

## 멀티 프로세스(Multi Process)와 멀티 스레드(Multi Thread)

### 멀티 프로세스

멀티 프로세스(Multi Process)는 하나의 프로그램을 여러 개의 프로세스로 실행하여 각자 작업을 수행하는 것을 말한다.  

#### 장점
- 안정성이 좋음
  - 자식 프로세스 중 하나에 문제가 있어도 다른 프로세스에 영향을 주지 않는다.
- 구현이 비교적 간단 

#### 단점
- 스케쥴링에 따른 Context Switching 이 많아짐 
- Context Switching 오버헤드
  - 캐시 메모리 초기화 같은 무거운 작업이 진행되고 많은 시간이 걸리기 때문에 오버헤드 발생
  - Context Switching 이 발생되면 캐시에 있는 모든 데이터를 지우고 다른 캐시 정보를 불러옴
- 프로세스들이 독립적으로 동작하며, 자원을 서로 다르게 할당 (데이터 공유 없음)
  - 프로세스간 통신을 위해서는 IPC를 통해야 함
- 메모리 사용량이 많음
  
### 멀티 스레드

멀티 스레드(Multi Thread)는 하나의 프로그램을 여러 개의 스레드로 구성하여, 
각 스레드에서 작업을 처리하는 것을 말한다.

#### 장점
- 시스템의 처리율 향상
- 효율적인 자원 관리
  - 프로세스 할당보다 스레드를 할당하는 것이 비용이 적음
  - 프로세스의 자원들을 공유
- 스레드 간의 통신 방법이 간단
  - stack을 제외한 모든 영역을 공유해서 통신이 쉬움
- Context Switching 이 빠름
- 일부 스레드에 오류가 있어도 프로그램이 계속 수행될 수 있음

#### 단점 
- 구현, 테스트, 디버깅이 어려움
- 동기화를 고려해야 하며, 교착 상태가 발생되지 않도록 주의해야 함
- 하나의 스레드에서 문제가 발생되면 전체 프로세스에 영향을 줄 수 있음
- 프로세스 밖에서 스레드 제어 불가능 


### 정리

|         Process         |                   Thread                    |
|:-----------------------:|:-------------------------------------------:|
|     프로그램이 실행 중을 의미      |                 프로세스의 세그먼트                  |
|     종료하는데 시간이 많이 걸림     |               종료하는데 시간이 적게 걸림               |
|        생성에 비용이 큼        |                 생성에 비용이 적음                  |
| context switching 비용이 큼 |          context switching 비용이 적음           |
|  통신 비용이 큼 (IPC 통해야 함)   |                통신 방법이 비교적 간단                |
|  다중 프로그램이 다중 프로세스를 의미   | 여러 프로그램 실행할 필요 없이,<br/> 단일 프로세스가 여러 스레드로 구성 |
|       프로세스간 서로 격리       |                 스레드간 메모리 공유                 |
|         중량 프로세스         |           코드, 데이터, 힙 영역을 공유하여 가벼움           |
| 프로세스 전환은 운영체제의 인터페이스 사용 |           스레드 전환은 운영 체제 호출이 필요 없음           |
|     다른 프로세스에 영향 없음      |         한 스레드가 차단하면 다른 스레드에서 작업 불가능         |
|  PCB, Stack, 주소 공간 존재   |     부모의 PCB와 자체 TCB, stack, 공통 주소 공간 존재     |
| 부모 프로세스는 자식 프로세스에 영향 없음 |        메인 스레드를 변경하면 다른 스레드 동작에 영향을 줌        |


## 출처
- [https://haedallog.tistory.com/138](https://haedallog.tistory.com/138)
- [https://www.geeksforgeeks.org/process-table-and-process-control-block-pcb/](https://www.geeksforgeeks.org/process-table-and-process-control-block-pcb/)
- [https://www.geeksforgeeks.org/difference-between-process-and-thread/](https://www.geeksforgeeks.org/difference-between-process-and-thread/)
- [https://www.geeksforgeeks.org/thread-control-block-in-operating-system/](https://www.geeksforgeeks.org/thread-control-block-in-operating-system/)
- [https://dingrr.com/blog/post/thread%EC%99%80-process%EC%9D%98-%EC%B0%A8%EC%9D%B4](https://dingrr.com/blog/post/thread%EC%99%80-process%EC%9D%98-%EC%B0%A8%EC%9D%B4)
- [https://en.wikipedia.org/wiki/Process_state](https://en.wikipedia.org/wiki/Process_state)
- [https://selfish-developer.com/entry/%EC%8A%A4%ED%83%9D-%ED%9E%99-%EC%BD%94%EB%93%9C-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%98%81%EC%97%AD](https://selfish-developer.com/entry/%EC%8A%A4%ED%83%9D-%ED%9E%99-%EC%BD%94%EB%93%9C-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%98%81%EC%97%AD)
- [https://d2.naver.com/helloworld/10963](https://d2.naver.com/helloworld/10963)
- [https://gmlwjd9405.github.io/2018/09/14/process-vs-thread.html](https://gmlwjd9405.github.io/2018/09/14/process-vs-thread.html)
- [https://charlezz.medium.com/process%EC%99%80-thread-%EC%9D%B4%EC%95%BC%EA%B8%B0-5b96d0d43e37](https://charlezz.medium.com/process%EC%99%80-thread-%EC%9D%B4%EC%95%BC%EA%B8%B0-5b96d0d43e37)