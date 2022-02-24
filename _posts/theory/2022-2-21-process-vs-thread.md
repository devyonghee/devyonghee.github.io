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

{% include image.html alt="프로세스 상태 (출처: [geeksforgeeks](https://www.geeksforgeeks.org/states-of-a-process-in-operating-systems/))" path="images/theory/process-vs-thread/process-state.png" %}

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

####Memory Management Information

운영체제에서 사용하는 메모리 관리 시스템에 대한 정보를 저장합니다.  
page table, memory limits, segment table 등이 포함될 수 있습니다. 

#### Open files list or I/O Status Information

프로세스가 현재 사용중인 파일 및 장치에 대한 포인터를 저장합니다.

#### Accounting Information

프로세스 실행에 사용된 CPU 크기, 시간 제한, 실행 ID 에 대한 정보를 저장합니다. 



## 출처
- https://haedallog.tistory.com/138
- https://www.geeksforgeeks.org/process-table-and-process-control-block-pcb/
- https://dingrr.com/blog/post/thread%EC%99%80-process%EC%9D%98-%EC%B0%A8%EC%9D%B4
- https://en.wikipedia.org/wiki/Process_state