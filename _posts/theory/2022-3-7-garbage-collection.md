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
이처럼, 자바에서도 Heap 영역을 정리해주지 않으면 계속 쌓이다가 `OutOfMemoryException` 이 발생할 수 있다. 
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

자세히 알아보아야 살펴봐야할 곳은 Runtime Data Area 이다.  
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

### Mark and Sweep

## Minor GC 

Minor GC 가 이루어지는 과정은 다음과 같다.

{% include image.html alt='CG before, after' source_text='naver d2' source="https://d2.naver.com/helloworld/1329" path="images/theory/garbage-collection/garbage-collectio-before-after.png" %}

1. 최초에 객체가 생성되면 Eden 영역에 생성
2. Eden 영역이 가득차게 되면 첫 번째 Minor GC 발생
3. 참조된 객체는 survivor0 영역에 Eden 영역을 복사하고, 참조되지 않은 객체들은 모두 제거
4. survivor0 영역이 가득차게 되면 다시 Minor GC 발생
5. 계속 참조되는 객체는 survivor1 영역으로 이동 (객체의 크기가 survivor 영역보다 큰 경우 Old 로 이동됨)
6. 이 과정을 반복하다가 계속 사용된다면 Old 영역으로 이동

## 출처
- https://namu.wiki/w/%EC%93%B0%EB%A0%88%EA%B8%B0%20%EC%88%98%EC%A7%91
- https://blog.metafor.kr/163
- https://velog.io/@recordsbeat/Garbage-Collector-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%95%8C%EA%B8%B0
- https://beststar-1.tistory.com/15
- https://d2.naver.com/helloworld/1329
- https://mangkyu.tistory.com/118
- https://catsbi.oopy.io/56acd9f4-4331-4887-8bc3-e3e50b2f3ea5
- https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html
- https://kamang-it.tistory.com/entry/%EB%8B%A4-%EC%93%B4-%EB%A9%94%EB%AA%A8%EB%A6%AC%EB%A5%BC-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%EC%88%98%EA%B1%B0%ED%95%B4%EC%A3%BC%EB%8A%94-%EA%B0%80%EB%B0%94%EC%A7%80%EC%BB%AC%EB%A0%89%ED%84%B0Garbage-CollectorGC-%EA%B8%B0%EB%B3%B8-%EC%9B%90%EB%A6%AC-%ED%8C%8C%ED%95%B4%EC%B9%98%EA%B8%B0