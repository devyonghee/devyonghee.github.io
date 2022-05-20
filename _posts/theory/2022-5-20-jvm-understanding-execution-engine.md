---
title: 자바 가상 머신(JVM, Java Virtual Machine) 자세히 알아보기 - Execution Engine
tags: [java, jvm, java virtual machine, execution engine]
categories: theory
---

JVM 은 Java Virtual Machine 의 약자로 자바 가상 머신을 의미한다.
자바 코드는 이 JVM 에 의해서 실행되는데 그렇다면 어떻게 실행되는지 알아보도록 한다.
이번 글에서는 JVM 의 Execution Engine 에 대해 자세히 알아본다.

<!--more-->

## JVM 구성

{% include image.html alt='jvm architecture' source_txt='Understanding JVM Architecture' source='https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722' path="images/theory/jvm-understanding/jvm-architecture.png" %}

1. ClassLoader Subsystem
2. Runtime Data Area
3. **Execution Engine**

## Execution Engine

Execution Engine 은 Class Loader 에 의해 적재된 Class 파일(바이트 코드)들을 기계어로 변경하여 실행한다.  
명령어 단위로 나누어서 실행하게 되는데 크게 두가지 방식이 사용된다. 

- 인터프리터(interpreter)
- JIT(just in time) 컴파일러


## Interpreter

{% include image.html alt='interpreter' source_txt='javatpoint' source='https://www.javatpoint.com/java-interpreter' path="images/theory/jvm-understanding/java-interpreter.png" %}

인터프리터는 바이트 코드를 한줄씩 기계어로 해석하고 명령을 실행한다.  
매번 동일한 메소드에 대해 기계어로 해석하고 실행하기 때문에 비효율적이고 속도가 느리다는 단점이 있다.  
이러한 성능 문제를 개선하기 위해 JIT 컴파일러가 도입되었다.

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


## 출처
- [https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722](https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722)