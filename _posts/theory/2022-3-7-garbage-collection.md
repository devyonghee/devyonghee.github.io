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

자세히 알아보아야 살펴봐야할 곳은 Runtime Data Area 이다.  
Runtime Data Area 은 JVM 의 메모리 영역으로 애플리케이션을 실행할 때 데이터들을 저장하는 영역이다.  

{% include image.html alt='java memory structure' source="https://www.yourkit.com/docs/kb/sizes.jsp" path="images/theory/garbage-collection/runtime-data-area-memory.png" %}

이 영역은 Method Area, Heap Area, Stack Area, PC Register, Native Method Stack 구분되거나 
위처럼 더 크게 Heap, None-Heap, Other 영역으로 구분될 수 있다. 
소개하는 곳마다 조금씩 다르기 때문에 본인에게 편한 방식대로 이해하도록 하자.   




## 출처
- https://namu.wiki/w/%EC%93%B0%EB%A0%88%EA%B8%B0%20%EC%88%98%EC%A7%91
- https://blog.metafor.kr/163
- https://velog.io/@recordsbeat/Garbage-Collector-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%95%8C%EA%B8%B0
- https://beststar-1.tistory.com/15
- https://d2.naver.com/helloworld/1329
- https://mangkyu.tistory.com/118
- https://catsbi.oopy.io/56acd9f4-4331-4887-8bc3-e3e50b2f3ea5