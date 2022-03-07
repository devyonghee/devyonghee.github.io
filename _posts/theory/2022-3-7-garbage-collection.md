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



## 출처
- https://namu.wiki/w/%EC%93%B0%EB%A0%88%EA%B8%B0%20%EC%88%98%EC%A7%91
- https://blog.metafor.kr/163
- https://velog.io/@recordsbeat/Garbage-Collector-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%95%8C%EA%B8%B0
- https://beststar-1.tistory.com/15
- https://d2.naver.com/helloworld/1329
- https://mangkyu.tistory.com/118
- https://catsbi.oopy.io/56acd9f4-4331-4887-8bc3-e3e50b2f3ea5