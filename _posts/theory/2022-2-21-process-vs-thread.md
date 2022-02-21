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

{% include image.html alt="프로세스 상태 (출처: wikipedia)" path="images/theory/process-vs-thread/process-state.png" %}

#### Created or New

프로세스가 처음 생성될 때의 상태입니다. 
'Created' 상태에서는 'ready' or 'waiting' 상태가 되는 것을 기다리고 있습니다.
이 상태 변경은 시스템에서 승인을 받아야 가능하지만, 대부분의 시스템에서는 자동으로 승인됩니다. 
하지만 **실시간 운영 체제**에서 너무 많은 프로세스를 'ready' 상태를 허용하면 시스템 **리소스가 과포화**될 수 있기 때문에 승인이 지연될 수 있습니다.


#### Ready or Waiting



## 출처
- https://haedallog.tistory.com/138
- https://dingrr.com/blog/post/thread%EC%99%80-process%EC%9D%98-%EC%B0%A8%EC%9D%B4
- https://en.wikipedia.org/wiki/Process_state