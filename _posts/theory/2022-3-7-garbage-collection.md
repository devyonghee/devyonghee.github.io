---
title: 가비지 컬렉션 (Garbage Collection) 자세히 알아보기
tags: [garbage collection, garbage collector, jvm, java]
categories: theory
---

자바는 JVM(Java Virtual Machine) 위에서 구동한다.  
JVM 중에 메모리를 관리하는 Garbage Collection 이라는 작업에 대해 자세히 알아본다.  

<!--more-->

## Garbage Collection 

가비지 컬렉션(Garbage Collection), 약어로 GC 라고도 부른다.  

메모리 관리 방법 중 하나로, 
사용자가 동적으로 할당한 메모리 영역 중 더이상 시스템에서 사용되지 않는 영역을 자동으로 메모리를 회수하는 기능이다.  
즉, 더이상 사용되지 않는 객체를 청소하여 공간을 확보하는 작업이다. 

C 언어의 경우에는 `free()` 라는 함수를 통해 직접 메모리를 해제해주어야 한다. 
하지만 메모리를 할당해놓고 더이상 사용하지 않아도 해제를 안해서 메모리 누수가 생긴다.  
이처럼, 자바에서도 Heap 영역을 정리해주지 않으면 계속 쌓이다가 `OutOfMemoryError` 가 발생할 수 있다. 
이 문제를 방지하기 위해 JVM 에서는 주기적으로 GC 를 실행한다. 

GC 작업을 통해 자동으로 메모리 관리가 되면, 
사용자가 메모리 관리 작업을 위한 코드를 작성하지 않아도 되고 메모리 누수, 비워진 객체를 찾기 위한 메모리 액세스 등의 문제를 해결할 수 있다.

### 장점

- 개발자가 수동으로 메모리를 해제할 필요가 없다.
- 힙에 효율적으로 개체를 할당한다.
- 더 이상 사용되지 않는 개체를 회수하고 메모리를 비우기 때문에 개체 생성자가 데이터 필드를 초기화할 필요가 없다.
- 개체에서 다른 개체의 콘텐츠를 사용할 수 없어서 메모리 안전하다.
- 유효하지 않은 포인터 접근: 이미 해제된 메모리에 대해 불필요한 액세스를 하지 않는다.
- 이중 해제: 해제된 메모리에 대해서 다시 해제하려는 시도를 방지한다.
- 메모리 누수: 더이상 필요하지 않는 메모리를 자동으로 회수하여 메모리 누수를 방지한다.

### 단점

- 알고리즘이 메모리 해제 시점을 추적하여 결정하는 비용이 든다.
  - 오버헤드가 된다.
- 가비지 컬렉션이 일어나는 시점이나 시간 예측이 어렵다. 
  - 프로그램이 예측 불가능하게 정지될 수 있다.
- 메모리 해제 시점을 파악할 수 없다.

## JVM 메모리

가비지 컬렉션 동작에 대해 이해하기 위해 자바 메모리 구조에 대해 자세히 알아본다.  

{% include image.html alt='jvm 구조'  path="images/theory/garbage-collection/jvm-structure.png" %}

자바 가상 머신(Java Virtual Machine, JVM)은 자바 프로그램을 실행하기 위해 환경을 제공하는 엔진으로,  
컴파일해서 받은 클래스 파일을 운영체제가 이해할 수 있는 기계어로 변경하여 실행시켜준다.  
JVM 구조를 보면 크게 Class Loader, Execution Engine, Runtime Data Area 나눠진다. 
각 영역에 대해서는 추후 JVM 구조에 대해 자세히 다루는 글에서 알아보겠다.  

### Runtime Data Area

자세히 살펴봐야할 곳은 Runtime Data Area 이다.  
Runtime Data Area 은 JVM 의 메모리 영역으로 애플리케이션을 실행할 때 데이터들을 저장하는 영역이다.  

{% include image.html alt='java memory structure' source="https://www.yourkit.com/docs/kb/sizes.jsp" path="images/theory/garbage-collection/runtime-data-area-memory.png" %}

이 영역은 Method Area, Heap Area, Stack Area, PC Register, Native Method Stack 구분되는데,  
크게 위처럼 Heap 이외에는 None-Heap 영역으로 구분될 수 있다. 

Heap 영역은 동적으로 할당하여 사용할 수 있는 메모리 영역으로 주로 실행중에 생성된 객체들이 저장된다.    
JVM 이 실행될 때 생성되며, 실행되는 동안 크기가 증가하거나 감소될 수 있다.  

Non-Heap 메모리는 Heap 이외의 영역으로 Method Area, Stack Area 등이 이 영역에 해당된다.  
마찬가지로 JVM 이 실핼될 때 생성된다. 
런타임 상수 풀, 정적 변수, 생성자, 메소드, 지역 변수 등이 저장된다. 

Other 에는 JVM 자체의 코드, 내부 구조, 로드된 프로파일러 에이전트 코드와 데이터 등이 저장된다.

### Heap

{% include image.html alt='heap memory' source_text='journaldev' source="https://www.journaldev.com/2856/java-jvm-memory-model-memory-management-in-java" path="images/theory/garbage-collection/heap-memory.png" %}

Heap 영역이 Garbage Collection 의 대상이 되기 때문에 더 자세히 알아본다.  
Heap은 다시 Young Generation, Old Generation, Perm 세가지 영역으로 구분된다.  
효율적으로 GC 를 발생시키기 위해 이렇게 나눠지게 되었다.   

#### Young Generation

새로 생성된 객체가 저장되는 영역이다.  
대부분의 객체는 금방 접근 불가능한 상태(unreachable)가 되어 많은 객체가 이 영역에서 생성되었다가 지워진다.  
이 영역안에서 객체가 지워지는 것을 Minor GC 가 발생된다고 한다.  

이 영역은 Eden 영역과 2개의 Survivor 영역으로 이루어져 있다.  
Young 영역에서 객체가 계속 참조 되어 사용되고 있다면 Old 영역으로 이동된다.

#### Old Generation

Young Generation 에서 제거되지 않고 남아있는 객체들이 저장되는 영역  
보통 Young 영역에 비해 크게 할당되며, 크기가 크기 때문에 GC 가 적게 발생된다.
이 영역에서 객체가 지워지는 것을 Major GC (또는 Full FC)가 발생된다고 한다.

Major GC 가 일어나면 Heap Memory 에 빈 공간이 생기게 되는데, 이 공간을 제거하기 위해 재구성을 하게 된다. 
이 때, 다른 스레드가 메모리를 사용하면 안되기 때문에 스레드가 정지된다. (stop the world) 
또한, CPU 에 부하를 주고 Minor GC에 비해 현저히 느리기 때문에 생명 주기가 짧은 객체는 Young Generation 에서 제거되도록 해야 한다.


#### Permanent Generation

클래스와 메소드 등의 메타 데이터를 저장하는 영역입니다. 
이 영역은 Java8 에서 제거 되었으며, 힙의 일부가 아닌 Meta Space 로 대체되었다.  
대체된 Meta Space 는 컴퓨터의 메모리를 직접 사용하게 된다.


## Stop the world

GC 가 실행되면 더이상 사용되지 않는 인스턴스의 할당된 메모리를 삭제하게 되는데, 
이 과정에서 GC 스레드를 제외한 모든 스레드는 작업이 중단된다. 
이것을 stop the world 현상이라고 한다. 
대개 GC를 튜닝한다고 한다면 이 stop the world 시간을 줄이기 위한 것이다.

보통 Java 에서 메모리를 명시적으로 해제하지 않는다.  
하지만, 명시적으로 해제를 하고 싶다면 다음 방법들을 이용할 수 있다.

- `System.gc()`
- `null` 할당

`null` 을 이용하는 것은 괜찮지만, 
`System.gc()` 호출하면 stop the world 가 발생하여 성능에 크게 영향을 주기 때문에 사용하면 안된다. 

## Garbage Collection 알고리즘

### Mark and Sweep (추적 기반 쓰레기 수집)

{% include image.html alt='mark and sweep' source_text='wikipedia' source="https://en.wikipedia.org/wiki/Tracing_garbage_collection#Na%C3%AFve_mark-and-sweep" path="images/theory/garbage-collection/mark-and-sweep.gif" %}

가장 많이 사용되는 기법으로 특별한 내용없이 GC 라고 한다면 이 방식을 의미한다.  
접근 가능한(reachable) 메모리에 마킹(mark)을 하고 마킹이 안된 메모리는 할당 해제(sweep)하는 방식이다.

stack, method 등 참조가 가능한 영역을 root set 이라고 하는데  
이 영역을 시작으로 참조된 객체들을 찾아다니면서 할당 받은 메모리 1비트에 표시하게 된다.

#### 1. Marking

{% include image.html alt='marking' source_text='oracle' source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/mark-and-sweep-marking.png" %}

첫번째 단계는 마킹으로 여기에서 사용중인 메모리와 사용되지 않는 메모리를 식별한다.  
참조된 대상은 파란색, 참조되지 않는 대상은 주황색이다.  
시스템의 모든 대상을 스캔해야하는 경우, 이 프로세스에 많은 시간이 소요될 수 있다.

#### 2. Deletion

{% include image.html alt='deletion' source_text='oracle' source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/mark-and-sweep-deletion.png" %}

참조되지 않는 대상을 삭제하여 빈 공간을 둔다.  
메모리 할당자는 새 객체를 할당할 수 있는 여유 공간에 대해 참조를 가지고 있는다.

#### 2a. Deletion with Compacting

{% include image.html alt='compacting' source_text='oracle' source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/mark-and-sweep-compacting.png" %}

참조되지 않는 대상을 삭제하면서 나머지 객체들을 압축하는 방식인 mark and compact 도 있다.  
압축하면 새 메모리 할당이 쉽고 빨라지기 때문에 성능이 향상된다. 

### Reference Counting 

Reference Counting 은 객체, 메모리 블록 등을 참조하는 Reference, Pointer, Handle 의 갯수를 저장하는 기술이다.  
간단하지만 강력하면서 많이 쓰인다. 
Perl, Php 등 같은 언어가 이 방식을 사용합니다.

{% include image.html alt='reference counting' source_text='plumbr' source="https://plumbr.io/handbook/what-is-garbage-collection/automated-memory-management/reference-counting" path="images/theory/garbage-collection/reference-counting.png" %}

초록색은 프로그래머가 아직 사용중인 개체다. 현재 실행중인 메소드의 정적 변수, 로컬 변수 등이 될 수 있다.  
파란색 원은 메모리에 살아있는 객체로 내부의 숫자는 참조 횟수를 의미한다.    
마지막으로, 회색원은 참조되지 않은 개체로 이 대상이 바로 가비지 컬렉션의 대상이 된다.

이 방식의 장점은 바로 컴파일 시간에 적용하는 것이 용이하다는 점이다.  
컴파일 시간에 변수들을 미리 찾아서 해제하는 로직이 가능하다.

{% include image.html alt='reference counting disadvantage' source_text='plumbr' source="https://plumbr.io/handbook/what-is-garbage-collection/automated-memory-management/reference-counting" path="images/theory/garbage-collection/reference-counting-disadvantage.png" %}

하지만 아주 큰 단점이 있다.
순환참조된 개체들을 제거할 수 없다는 것이다. 
빨간색 원을 보면 사용되고 있지 않지만, 참조 횟수가 0이 되지 않는다. 
그렇기 때문에 메모리 누수가 발생될 수 있다. 

## Garbage Collection Process

힙의 구조에 대해서 알아봤으니, 이제 Garbage Collection 이 이루어지는 과정에 대해서 알아보겠다.

#### 1. Object Allocation

{% include image.html alt="Object Allocation" source_text="oracle" source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/process1.png" %}

두 개의 Survivor 영역은 모두 비어있는 상태이고, 새로운 객체는 Eden 영역에 할당된다. 

#### 2. Filling the Eden Space

{% include image.html alt="Filling the Eden Space" source_text="oracle" source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/process2.png" %}

Eden 영역이 가득 차면 Minor GC가 동작한다. 

#### 3. Copying Referenced Objects

{% include image.html alt="Copying Referenced Objects" source_text="oracle" source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/process3.png" %}

참조된 객체는 S0 영역으로 이동된다.  
여기서 참조되지 않는 객체들은 모두 eden 영역에서 제거된다.

#### 4. Object Aging

{% include image.html alt="Object Aging" source_text="oracle" source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/process4.png" %}

다음 Minor GC 가 발생되면 참조되는 객체는 S1 영역으로 이동된다.  
S0 영역에서 참조되는 객체는 S1으로 이동되면서 참조횟수가 증가된다.  
이동하고나면 S0 과 eden 영역은 비워진다. 

#### 5. Additional Aging

{% include image.html alt="Additional Aging" source_text="oracle" source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/process5.png" %}

다음 Minor GC 역시 동일한 과정으로 진행되지만, 이번에는 Survivor 영역이 변경된다.  
다시 사용되고 있는 객체는 참조횟수가 증가되고 S1 과 eden 영역은 비워진다. 

#### 6. Promotion

{% include image.html alt="Promotion" source_text="oracle" source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/process6.png" %}

반복되는 Minor GC 이후에도 계속 사용되어 제거되지 않는 객체들이 있을 것이다. 
특정 참조횟수가 넘으면, 해당 객체는 Young generation 에서 Old generation 으로 이동된다.

{% include image.html alt="Promotion" source_text="oracle" source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/process7.png" %}

Minor GC 계속 발생되고 오래사용되는 객체는 계속해서 Old generation 으로 이동된다.

#### GC Process Summary

{% include image.html alt="GC Process Summary" source_text="oracle" source="https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" path="images/theory/garbage-collection/process-summary.png" %}

Young generation 에서는 전체적인 Garbage Collection 과정을 다루고, 
결국에는 Old generation 에서는 Major GC 가 이뤄지게 된다. 


## Garbage Collection 방식

Garbage Collection 을 하는 방식은 JDK7 에서 다음 5가지가 존재한다.
- Serial GC
- Parallel GC
- Parallel Old GC (Parallel Compacting GC)
- Concurrent Mark & Sweep GC (CMS)
- G1(Garbage First) GC

GC 방식에 따라 처리하는 과정이 다르므로 한가지씩 살펴보도록 하겠다. 


### Serial GC (-XX:+UseSerialGC)

{% include image.html alt="Serial GC" path="images/theory/garbage-collection/serial-gc.png" %}

- 가장 단순한 방식으로 싱글 스레드로 동작한다.
- 싱글 스레드로 실행하기 때문에 Stop The World 시간이 다른 GC 에 비해 길다.
- Mark & Sweep & Compact 알고리즘을 사용한다.
  1. 참조되고 있는 객체를 식별(Mark)
  2. 힙 영역의 앞에서부터 사용되지 않는 객체는 제거한다. (Sweep)
  3. 남아있는 객체들이 연속되게 쌓이도록 힙의 앞 부분부터 정렬한다. (Compact)

이 방식은 적은 메모리와 CPU 코어 갯수가 적을 때 적절하다.  
멀티스레드 환경에서는 사용하지 않는 것이 좋으며, 보통 실무에서 잘 사용되지 않는다.


### Parallel GC (-XX:+UseParallelGC)

{% include image.html alt="Parallel GC" path="images/theory/garbage-collection/parallel-gc.png" %}

Parallel GC 는 기본적으로 Serial GC 와 알고리즘이 동일하다.  
그러나 Serial GC 는 하나의 스레드에서 처리하는 것에 비해,
Parallel GC 는 시스템의 CPU 코어 수만큼 여러개의 스레드에서 처리된다.   
그래서 Serial GC 보다 빠르게 처리된다.  

Parallel GC 는 메모리가 충분하고 코어의 갯수가 많을 수록 유리하고 Throughput GC 라고도 부른다.  
Parallel GC 는 JDK8 에서 기본으로 사용되는 GC 방식이다.

### Concurrent Mark Sweep (CMS) Collector (-XX:+UseConcMarkSweepGC)

{% include image.html alt="CMS GC" path="images/theory/garbage-collection/cms-gc.png" %}

CMS GC 는 Stop the Wold 의 시간을 최소화시키기 위해 고안된 방식으로 Low Latency GC 라고도 한다.  
진행중인 스레드가 정지되지 않고 백그라운드에서 GC가 가능하기 때문에 Stop the Wold 시간이 짧다.  
그래서 응답 속도가 중요한 경우에 사용한다.

#### 과정
1. Initial Mark: 클래스 로더에 가장 가까운 객체 중 사용되는 객체만 찾는다. 그래서 멈추는 시간이 짧다.
2. Concurrent Mark: 사용되는 객체에서 참조하는 객체들을 따라가며 확인한다. 다른 스레드가 실행중인 상태에서 동시에 진행된다.
3. Remark: Concurrent Mark 단계에서 추가되거나 참조가 끊긴 객체를 확인한다.
4. Concurrent Sweep: 쓰레기를 정리한다. 다른 스레드가 실행중인 상태에서 동시에 진행된다. 

#### 단점
- 다른 GC 방식에 비해 CPU 를 많이 사용한다. 
  - 만약 CPU 리소스가 부족해지거나, 메모리 파편화가 심헤 메모리 공간이 부족해지면 Serial GC 처럼 동작한다. 
- Compaction 단계가 제공되지 않는다.

### Garbage First(G1) GC (-XX:+UseG1GC)

G1 GC는 CMS Collector 를 대체하기 위해 나온 방식이다.  
JDK6 에서는 early access 라고 불리며 테스트로 사용할 수 있었지만, JDK7 에서 정식으로 포함해서 제공됐다.  
JDK9 에서는 기본으로 사용되고 있는 방식이다.

G1 GC는 병렬(parallel), 동시(concurrent) 에서 동작하면서 점진적으로 정렬(compact)하여, 
Stop The World 시간이 짧으며 다른 GC 비해 빠르다.

{% include image.html alt="G1 GC" path="images/theory/garbage-collection/garbage-first-gc.png" %}

Young Generation 과 Old Generation 영역이 없는 방식으로 
힙 공간을 위 이미지처럼 동일한 크기의 영역으로 나눠서 객체를 할당한 뒤 GC 를 실행한다.  
GC 가 실행되면 남아있는 메모리가 적은 영역부터 먼저 수집하게 되므로 "Garbage First" 라고 부른다.

G1 GC는 문자열 중복 제거라는 뛰어난 최적화 기능을 제공한다.  
힙에서 여러 번 발생되는 문자열을 식별하고 힙에 복사본이 없도록 동일한 `char[]` 배열을 가리키도록 한다.  
이 기능은 `XX:+UseStringDeduplication` JVM 인자를 통해 활성화 시킬 수 있다.


### The Z Garbage Collector (ZGC) (-XX:+UnlockExperimentalVMOptions -XX:+UseZGC)

ZGC 는 확장 가능하고 Stop the world 시간이 적은 (low-pause) GC 이다.  
기존의 GC 들은 모두 중단되는 시간이 있어서 성능에 영향이 있었다.  
ZGC 는 이러한 성능을 개선하기 위해 나왔고 JDK 11에서 선보였다.

{% include image.html alt="colored pointer" source_text="packtpub" source="https://hub.packtpub.com/getting-started-with-z-garbage-collectorzgc-in-java-11-tutorial/" path="images/theory/garbage-collection/colored-pointer.png" %}

ZGC 는 GC 메타데이터를 객체의 메모리 주소에 표시한다.  
메모리의 주소 파트로 42비트를 사용하고 다른 4비트를 GC metadata (finalizable, remap, mark1, mark0)를 저장한다.

- finalizable: finalizer 통해서만 참조되는 객체, 해당 pointer 가 mark 되어 있으면 none-live Object
- remapped: 해당 객체의 재배치 여부를 판단하는 pointer, 1 이라면 최신 참조 상태 
- Marked 0, Marked 1: 객체가 live 상태인지 확인 여부

#### ZGC 목표

- 정지 시간이 최대 10ms 초과하면 안됨
- Heap 의 크기가 증가해도 정지 시간은 증가하지 않음
- 8MB ~ 16TB 에 이르는 다양한 크기의 Heap 을 다룰 수 있어야 함
- G1 보다 애플리케이션 처리량이 15% 이상 떨어지면 안됨

#### ZGC 특징

- GC 정지 시간이 10ms 초과하지 않음 (low latency)
- Heap 이 증가해도 정지 시간이 증가하지 않음 (Scalable)
- 8MB ~ 16TB 크기까지 다양한 크기의 Heap 처리 가능
- GC 와 관련된 모든 작업을 애플리케이션과 동시에 작업 (concurrently)
- GC Thread 를 여러개 동작 시킬 수 있음
  - 스레드 수가 너무 적으면 Garbage가 누적 (메모리 누수), 너무 크게 설정하면 애플리케이션의 CPU 수행 시간을 소모하여 처리량이 감소
- 64bit 메모리 공간을 필요로 하기 때문에 32bit 기반의 플랫폼에서 사용 불가능

#### ZGC heap

{% include image.html alt="ZGC" source_text="packtpub" source="https://hub.packtpub.com/getting-started-with-z-garbage-collectorzgc-in-java-11-tutorial/" path="images/theory/garbage-collection/zgc-heap-regions.png" %}

ZGC 는 메모리를 ZPages 라고 불리는 영역으로 나눈다.
ZPages 는 동적으로 생성 및 삭제될 수 있으며, 
G1 GC와 다르게 2MB의 배수로 크기를 동적으로 조정할 수 있다. 

- Small (2 MB)
- Medium (32 MB)
- Large (N * 2 MB)

여기서 Large 타입 페이지는 하나의 객체만 저장된다.  
그러므로 Medium 타입보다 작은 사이즈가 될 수 있다.



## 출처
- [https://namu.wiki/w/%EC%93%B0%EB%A0%88%EA%B8%B0%20%EC%88%98%EC%A7%91](https://namu.wiki/w/%EC%93%B0%EB%A0%88%EA%B8%B0%20%EC%88%98%EC%A7%91)
- [https://blog.metafor.kr/163](https://blog.metafor.kr/163)
- [https://velog.io/@recordsbeat/Garbage-Collector-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%95%8C%EA%B8%B0](https://velog.io/@recordsbeat/Garbage-Collector-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%95%8C%EA%B8%B0)
- [https://beststar-1.tistory.com/15](https://beststar-1.tistory.com/15)
- [https://d2.naver.com/helloworld/1329](https://d2.naver.com/helloworld/1329)
- [https://mangkyu.tistory.com/118](https://mangkyu.tistory.com/118)
- [https://memostack.tistory.com/229](https://memostack.tistory.com/229)
- [https://catsbi.oopy.io/56acd9f4-4331-4887-8bc3-e3e50b2f3ea5](https://catsbi.oopy.io/56acd9f4-4331-4887-8bc3-e3e50b2f3ea5)
- [https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html)
- [https://kamang-it.tistory.com/entry/%EB%8B%A4-%EC%93%B4-%EB%A9%94%EB%AA%A8%EB%A6%AC%EB%A5%BC-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%EC%88%98%EA%B1%B0%ED%95%B4%EC%A3%BC%EB%8A%94-%EA%B0%80%EB%B0%94%EC%A7%80%EC%BB%AC%EB%A0%89%ED%84%B0Garbage-CollectorGC-%EA%B8%B0%EB%B3%B8-%EC%9B%90%EB%A6%AC-%ED%8C%8C%ED%95%B4%EC%B9%98%EA%B8%B0](https://kamang-it.tistory.com/entry/%EB%8B%A4-%EC%93%B4-%EB%A9%94%EB%AA%A8%EB%A6%AC%EB%A5%BC-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%EC%88%98%EA%B1%B0%ED%95%B4%EC%A3%BC%EB%8A%94-%EA%B0%80%EB%B0%94%EC%A7%80%EC%BB%AC%EB%A0%89%ED%84%B0Garbage-CollectorGC-%EA%B8%B0%EB%B3%B8-%EC%9B%90%EB%A6%AC-%ED%8C%8C%ED%95%B4%EC%B9%98%EA%B8%B0)
- [https://www.betsol.com/blog/java-memory-management-for-java-virtual-machine-jvm/#:~:text=The%20Java%20Virtual%20Machine%20has,as%20well%20as%20interned%20Strings.](https://www.betsol.com/blog/java-memory-management-for-java-virtual-machine-jvm/#:~:text=The%20Java%20Virtual%20Machine%20has,as%20well%20as%20interned%20Strings.)
- [https://hub.packtpub.com/getting-started-with-z-garbage-collectorzgc-in-java-11-tutorial/](https://hub.packtpub.com/getting-started-with-z-garbage-collectorzgc-in-java-11-tutorial/)