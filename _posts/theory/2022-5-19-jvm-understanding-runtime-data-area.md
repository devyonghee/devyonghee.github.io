---
title: 자바 가상 머신(JVM, Java Virtual Machine) 자세히 알아보기 - Runtime Data Area
tags: [java, jvm, java virtual machine, runtime data area]
categories: theory
---

JVM 은 Java Virtual Machine 의 약자로 자바 가상 머신을 의미한다.
자바 코드는 이 JVM 에 의해서 실행되는데 그렇다면 어떻게 실행되는지 알아보도록 한다.
이번 글에서는 JVM 의 Runtime Data Area 에 대해 자세히 알아본다. 
    
<!--more-->

## JVM 구성

{% include image.html alt='jvm architecture' source_txt='Understanding JVM Architecture' source='https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722' path="images/theory/jvm-understanding/jvm-architecture.png" %}

1. ClassLoader Subsystem
2. **Runtime Data Area**
3. Execution Engine

## Runtime Data Area

{% include image.html alt='run time data areas' source_txt='programcreek' source='https://www.programcreek.com/2013/04/jvm-run-time-data-areas/' path="images/theory/jvm-understanding/run-time-data-areas.png" %}

Runtime Data Area은 JVM 메모리 영역으로 OS에서 애플리케이션이 실행되면서 할당되는 메모리 영역이다.  

클래스 로더에서는 클래스 파일을 읽는 것 이외에도 데이터를 생성하고 아래와 같은 정보를 메소드 영역(method area)에 저장하게 된다.

- 직계 상위 클래의 이름
- `.class` 파일이 `Class`/`Interface`/`Enum` 과 관련 여부
- 수정자, 정적 변수, 메소드 정보 등

로드된 `.class` 파일은 `java.lang` 패키지에 정의된대로 heap memory에 `Class` 객체를 생성한다.
이 `Class` 객체는 클래스에 대한 정보(이름, 상위 클래스, 메소드, 정적 변수 등)를 확인하기 위해 사용된다.  

Runtime Data Area 영역은 주로 다음과 같이 구분된다. 

- Method Area
- Heap Area
- Stack Area 
- PC Register 
- Native Method Stack

### 1 Method Area (class area, code area, static area)

메소드 영역은 클래스 수준의 데이터와 정적 변수가 저장되는 영역으로, JVM 당 하나만 존재하는 공유 자원이다.  
그러므로 스레드로부터 안전하게 다뤄야 한다.  
이 영역은 JVM 이 구동 시작하면서 생성되고, 종료될 때까지 유지된다. 

메소드 영역에 저장되는 클래스 수준의 정보는 다음과 같다.

- Classloader reference
- runtime constant pool
  - 클래스 및 인터페이스의 숫자 상수, 필드 참조, 메소드 참조
  - JVM 은 이  runtime constant pool 을 이용하여 메소드나 필드의 실제 주소를 검색
- field data
  - name
  - type
  - modifier(`private`, `protected`, `public`,`static`, `final`, `volatile`, `transient`)
  - attributes
- method data
  - name
  - return type
  - parameter types(in order)
  - modifier(`private`, `protected`, `public`,`static`, `final`, `syncronized`, `native`, `abstract`)
  - attributes
- method code
  - byte code 
  - operand stack 및 local variable 크기
  - local variable 및 exception table
  - exception table 의 예외 처리기 정보
    - start and end point, PC offset for handler code, 예외 클래스의 constant pool index

### 2 Heap Area

힙 영역은 모든 객체의 정보를 저장하는 영역으로, JVM 에 하나만 존재하는 공유 자원이다.  
각 스레드에서 메모리를 공유하고 있기 때문에 multiple threads 환경에서 안전하지 않다.

인스턴스가 동적으로 생성되면 힙 영역의 메모리에 할당되어 사용되는데,  
레퍼런스 변수의 경우에는 인스턴스가 아니라 포인터가 저장된다.

힙 영역이 정리하지 되지 않고 가득차게 되면 `OutOfMemoryError` 가 발생된다.  
이 문제가를 방지하기 위해 JVM 에서 주기적으로 Garbage Collection 을 실행한다.  
참조되지 않은 인스턴스, 배열에 대한 정보가 힙 영역에 존재하기 때문에 Garbage Collection 의 대상이 된다.  

{% include image.html alt='heap memory' source_text='journaldev' source="https://www.journaldev.com/2856/java-jvm-memory-model-memory-management-in-java" path="images/theory/jvm-understanding/heap-memory.png" %}

힙 영역은 효율적으로 GC 를 실행하기 위해 다시 Young Generation, Old Generation, Perm 세가지 영역으로 구분하게 되는데, 
자세한 내용은 [Garbage Collection](https://devyonghee.github.io/theory/2022/03/07/garbage-collection/) 을 참고하도록 한다.

### 3 Stack Area

스택 영역은 공유되는 자원이 아닌, 스레드가 시작되면 메서드 호출을 저장하기 위해 각 스레드별로 따로 할당되는 영역이다.  
그렇기 때문에 멀티 스레드 환경에서도 동시성 문제가 발생되지 않는다.

스택 영역의 크기는 동적 또는 고정일 수 있으나, 크기가 넘치게 되면 `stackOverflowError` 가 발생된다.  
하지만, 스레드에 새 프레임을 할당한 메모리가 부족하게 되면 `OutOfMemoryError` 가 발생된다.

{% include image.html alt='stack frame' source_txt='medium' source='https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722' path="images/theory/jvm-understanding/stack-frame.png" %}

스레드에서 메서드 호출이 되면 스택 프레임(stack frame)이 생성되어 스택의 가장 위에 추가(push) 된다.
스택 프레임에는 local variable, operand stack, 실행중인 메소드의 클래스 runtime constant pool 정보들이 존재한다.
메서드가 종료되거나 예외가 발생되면 스택 프레임은 제거(pop)가 되는데, 예외의 경우 stack trace 의 각 라인이 stack frame 을 의미한다.

- local variable array
  - 0부터 시작하는 인덱스를 가짐
  - 지역 변수의 수와 값이 저장
  - 0은 메소드가 속한 클래스 인스턴스의 참조
  - 1부터 메소드로 전송된 `parameter` 저장
  - `parameter` 이후에 메소드 로컬 변수 저장
- operand stack
  - 작업을 수행하기 위한 런타임 작업 공간 역할
  - 각 메소드에서 스택과 지역 변수 데이터를 교환, 메소드 호출 결과를 push or pop
  - operand stack 공간의 필요한 크기는 컴파일 중에 결정할 수 있음
- frame data
  - 메소드와 관련된 모든 정보 저장
  - 예외의 경우 `catch` 블록 정보도 저장

스택 영역과 힙 영역에 대해 자세히 알아보기 위해 예시 코드를 통해 알아본다.

```java 
class Person {
    int id;
    String name;

    public Person(int id, String name) {
        this.id = id;
        this.name = name;
    }
}

public class PersonBuilder {
    private static Person buildPerson(int id, String name) {
        return new Person(id, name);
    }

    public static void main(String[] args) {
        int id = 23;
        String name = "John";
        Person person = null;
        person = buildPerson(id, name);
    }
}
```

{% include image.html alt='java stack heap' source_txt='baeldung' source='https://www.baeldung.com/java-stack-heap' path="images/theory/jvm-understanding/java-stack-heap.png" %}

1) `main()` 메소드를 호출하면 스택 메모리에 메소드의 기본 요소와 참조를 저장하기 위한 공간이 생성된다.
  - `integer id` 의 원시 값을 스택 메모리에 직접 저장
  - `Person` 타입의 참조 변수 `person`도 스택 메모리에 생성되어 힙의 실제 객체를 가리킴
2) `main()` 에서 `Person` 생성자를 호출하면 이전 스택위에 메모리에 추가되어 할당
  - 스택 메모리에 있는 `this` 객체 참조 저장
  - 스택 메모리의 원시 `id` 값 저장
  - 힙 메모리에 있는 string pool 에서 실제 인자 문자열 참조 변수 저장
3) `buildPerson()` 정적 메소드를 호출하고 있어서 위와 같은 방식으로 변수를 다시 저장하고 이전 스택 위에 스택 메모리 추가 할당
4) 힙 메모리에는 새로 생성된 `person` 인스턴스 변수를 저장


### 4 PC(Program Counter) Register

{% include image.html alt='pc register' source_txt='naver blog' source='https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=2000yujin&logNo=130156226754' path="images/theory/jvm-understanding/pc-register.png" %}

PC(Program Counter) Register 는 현재 실행 중인 명령어의 주소를 저장하는 메모리 공간이다.  
Java 는 멀티 스레드 환경을 지원하므로 새 스레드가 생성될 때마다 PC Register 가 생성된다. (각 스레드마다 PC Register 존재)   

스레드에서 메소드를 호출할 때 PC Register 에는 현재 수행중인 instruction 주소가 저장된다.  
이 주소는 native pointer 또는 method bytecode 시작 지점이 될 수 있다.
하지만, 호출된 메소드가 native method 라면 PC Register 에는 기록되지 않는다.(undefined)

실행이 완료되면 PC Register 는 다음 명령어(instruction)의 주소로 변경(update)된다.  

### 5 Native Method Stack

{% include image.html alt='stack that invokes native method' source_txt='artima' source='https://www.artima.com/insidejvm/ed2/jvm9.html' path="images/theory/jvm-understanding/native-method-stack.png" %}

Java 는 네이티브 응용 프로그램 또는 다른 언어로 작성된 라이브러리를 호출하기 위한 프레임워크, JNI(Java Native Interface)을 제공한다.  
Java 스레드와 OS 스레드 간에 직접 매핑을 해주는데 호출 되는 native method 는 주로 C/C++ 언어로 작성된다.

Native Method Stack 은 이러한 JNI 를 통해 호출 되는 정보를 저장하기 위한 생성되는 native stack 이다.  
스레드가 생성되면 Native Method Stack 도 동시에 생성되며, 스레드가 종료되면 native, java 스레드에 대한 리소스가 해제된다.

프로그램에서 Native Method 을 호출하면 이를 호출한 Method 의 Stack Frame 은 남겨두고 Native Function 을 수행한다.  
Native Function 이 끝나면 다시 Java Stacks 으로 돌아오는데, 
여기서 호출한 Stack Frame으로 돌아오는 것이 아니라 새로운 Stack Frame을 생성하여 이전 작업을 계속 수행한다. 

- 스레드에서 허용된 것보다 더 큰 native method stack 이 필요하면 JVM 은 `StackOverflowError`을 발생시킨다.
- native method stack 은 동적으로 확장할 수 있다. 하지만 확장을 시도했는데 메모리가 충분하지 않거나 부족한 경우 JVM 은 `OutOfMemoryError`을 발생시킨다.



## 출처
- [https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722](https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722)
- [https://www.geeksforgeeks.org/jvm-works-jvm-architecture]([https://www.geeksforgeeks.org/jvm-works-jvm-architecture])
- [https://javatutorial.net/jvm-explained](https://javatutorial.net/jvm-explained)
- [https://dzone.com/articles/jvm-architecture-explained](https://dzone.com/articles/jvm-architecture-explained)
- [https://www.programcreek.com/2013/04/jvm-run-time-data-areas](https://www.programcreek.com/2013/04/jvm-run-time-data-areas)
- [https://www.baeldung.com/java-stack-heap](https://www.baeldung.com/java-stack-heap)
- [https://javapapers.com/core-java/java-jvm-run-time-data-areas](https://javapapers.com/core-java/java-jvm-run-time-data-areas)
- [https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=2000yujin&logNo=130156226754](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=2000yujin&logNo=130156226754)