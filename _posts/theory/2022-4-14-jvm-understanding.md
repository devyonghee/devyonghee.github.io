---
title: 자바 가상 머신(JVM, Java Virtual Machine) 자세히 알아보기
tags: [java jvm, java virtual machine, jit, just-in-time]
categories: theory
---

JVM 은 Java Virtual Machine 의 약자로 자바 가상 머신을 의미한다.  
자바 개발자라면 자바 코드가 이 JVM 에 의해서 실행된다는 것을 알고 있을 것이다.  
    
<!--more-->

## JVM (Java Virtual Machine)

JVM 은 JAVA 와 OS 사이의 중개자 역할로 Java Byte Code 를 OS 에 맞게 해석하고 실행한다.  
그렇기 때문에 자바는 JVM 덕분에 OS에 종속되지 않고 실행될 수 있다. 

Java compiler(`javac`) 는 java 소스 코드(`*.java`)를 java byte code(`*.class`) 로 변환시켜준다.  
하지만 이 java byte code 는 기계어가 아니기 OS 에서 바로 실행이 불가능하다.  
이 java byte code 는 Class Loader 에 의해 JVM 에 적재된다.  
JVM 에 적재된 코드는 JIT 컴파일 방식으로 실행된다.

## JIT(just-in-time) compiler

{% include image.html alt='jit compiler' source_txt='biomedcentral' source='https://bmcbioinformatics.biomedcentral.com/articles/10.1186/s12859-021-04547-0' path="images/theory/jvm-understanding/jit-compiler.png" %}

JIT 컴파일 방식은 동적 번역(dynamic translation)이라고도 하며, 
기존의 인터프리터 방식의 문제점을 보완하기 위해 도입된 방식이다.

인터프리터 방식의 경우 프로그램을 실행하는 시점에 필요한 부분을 즉석으로 번역하고 실행한다. 
JIT 컴파일러는 즉석으로 번역하는 대신 자주 사용되는 코드를 캐싱하고 변경된 부분만 컴파일한다.

### 장점
- 캐싱된 코드를 사용하기 때문에 인터프리터(interpreter) 방식에 비해 실행 속도 개선

### 단점
- 초기 구동 시, 컴파일하는데 시간과 메모리를 소모하기 때문에 정적 컴파일(static compile) 방식에 비해 실행 속도가 느림
- 실행 시간이 매우 짧은 경우, 컴파일된 코드를 재사용하지도 못하고 프로그램이 끝날 수 있음
- 런타임에 동적으로 코드를 생성하기 때문에 잠재적인 보안 문제
  - JIT 컴파일러 자체에 버그가 있는 경우 보안 취약점이 될 수 있음

> #### interpreter 방식  
> 소스 코드를 한줄씩 해석하고 바로 실행하는 방식  
> 컴파일하는 시간이 없지만 해석과 실행을 동시에 하기 때문에 속도가 느림 
> 
> #### static compile 방식
> 실행하기전에 소스 코드를 한번에 다른 코드(ex. native code)로 번역하는 방식  
> 컴파일된 코드를 실행하기 때문에 속도는 빠르지만, 컴파일하는 과정에 시간과 메모리를 많이 사용

## JVM 구성

{% include image.html alt='jvm architecture' source_txt='Understanding JVM Architecture' source='https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722' path="images/theory/jvm-understanding/jvm-architecture.png" %}

1. ClassLoader Subsystem
2. Runtime Data Area
3. Execution Engine

### 1. Class Loader Subsystem

JVM 은 기본적으로 RAM 위에서 동작하게 되는데  
Class Loader Subsystem 을 통해 클래스 파일들을 RAM 으로 가져온다.  
이 과정을 동적 클래스 로딩(dynamic class loading) 이라고 하며,  
클래스 파일은 컴파일 타임이 아니라 처음 클래스를 참조할 때 로드 및 초기화 된다.

#### 1.1 Loading

Java ClassLoader 는 컴파일 된 파일(`.class`) 메모리에 로드한다.   
실행중인 클래스에서 다른 클래스를 참조할 때 Loading 을 시도하게 되며, 보통 메인 클래스(`main()`) 부터 시작된다.  

#### 1.1.1) Bootstrap Class Loader

부트스트랩 경로(`$JAVA_HOME/jre/lib`)에 있는 
핵심 자바 API 클래스 같은 `rt.jar` 에서 JDK 내부 클래스를 로드한다. (ex. `java.lang.*` 패키지 클래스)  
C/C++와 같은 네이티브 언어로 구현되며, 이 로더에게 가장 높은 우선순위가 부여된다.

#### 1.1.2) Extension Class Loader

Bootstrap Class Loader 의 자식이다.  
JDK 확장 디렉토리(`JAVA_HOME/jre/lib/ext` 또는 `java.ext.dirs` 지정된 디렉토리) 에서 클래스를 로드한다. 


#### 1.1.3) System/Application Class Loader



클래스 로더는 아래 4가지 주요 원칙을 따르고 있다.

##### 원칙 1) Visibility Principle

##### 원칙 2) Uniqueness Principle

##### 원칙 3) Delegation Hierarchy Principle

##### 원칙 4) No Unloading Principle



## 출처
- [https://d2.naver.com/helloworld/1230](https://d2.naver.com/helloworld/1230)
- [https://asfirstalways.tistory.com/158](https://asfirstalways.tistory.com/158)
- [https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722](https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722)
- [https://www.geeksforgeeks.org/jvm-works-jvm-architecture]([https://www.geeksforgeeks.org/jvm-works-jvm-architecture])
- [https://javatutorial.net/jvm-explained](https://javatutorial.net/jvm-explained)
- [https://dzone.com/articles/jvm-architecture-explained](https://dzone.com/articles/jvm-architecture-explained)