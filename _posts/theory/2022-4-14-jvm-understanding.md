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

JDK 확장 디렉토리(`JAVA_HOME/jre/lib/ext` 또는 `java.ext.dirs` 지정된 디렉토리) 에서 클래스를 로드한다.
Bootstrap Class Loader 자식이기도 하다.

#### 1.1.3) System/Application Class Loader

모든 응용 프로그램 수준의 클래스를 JVM 으로 로드하는 역할이다. 
`java.class.path` 에 매핑된 classpath 환경변수 , `-cp` 또는 `-classpath` 옵션으로 찾은 클래스를 로드한다.
Extension Class Loader 자식이기도 하다.


클래스 로더는 아래 4가지 주요 원칙을 따르고 있다.

##### 원칙 1) Visibility Principle (가시범위 원칙)

자식 클래스 로더는 부모 클래스 로더가 로드한 클래스를 볼 수 있지만,  
부모 클래스는 자식 클래스가 로드한 클래스를 확인할 수 없다.

만약, 이 원칙이 없다면 클래스 로더는 위와 같은 계층 구조가 존재할 수 없다.  
격리 수준이 존재하지 않으면 모든 클래스들을 로드해오는 플랫 클래스로더와 동일하다.

##### 원칙 2) Uniqueness Principle (유일성 원칙)

부모에 의해 로드된 클래스가 자식 클래스 로더에서 다시 로드되지 않도록 유일성을 보장하는 원칙이다.  
이 원칙에 의해 클래스를 중복으로 로드하지 않는다.

##### 원칙 3) Delegation Hierarchy Principle (위임 원칙)

{% include image.html alt='delegation hierarchy principle' source_txt='stackoverflow' source='https://stackoverflow.com/questions/34650568/difference-between-appclassloader-and-systemclassloader' path="images/theory/jvm-understanding/delegation-hierarchy-principle.png" %}

JVM 은 클래스 로딩 요청에 대해 계층 구조에 따라 적절한 클래스 로더를 선택 위임한다.  
Application Class Loader 는 낮은 레벨의 클래스 로딩 요청을 Extension Class Loader 에 위임,  
Extension Class Loader 는 Bootstrap Class Loader 에 요청을 위임한다. 


##### 원칙 4) No Unloading Principle

클래스 로더는 클래스를 로드할 수 있지만 로드 된 클래스를 언로드할 수 없다.  
하지만, 언로딩 대신 현재 클래스 로더를 삭제하고 새로운 클래스 로더로 생성할 수 있다.

#### 1.2 Linking

링크는 로드된 클래스, 인터페이스 등 필요에 따라 요소의 타입에 따라 
검증(verification) -> 준비(preparation) -> 해결(resolution) 3단계가 이루어진다.  
이 단계가 진행되면서 아래의 특성들을 따르고 있다.

- 링크가 되기전에 클래스 또는 인터페이스는 완전히 로드가 되어야 한다.
- 클래스나 인터페이스는 초기화되기 전에 완전히 검증되고 준비가 되어 있어야 한다.
- 링크되는 동안 오류가 발생되면, 관련된 클래스 또는 인터페이스가 필요한 프로그램 한 부분에서 오류가 발생된다.

##### 1.2.1 Verification

- `.class` 파일의 형식이 유효한지 확인 (Java, JVM 사양에 따라 유효한 코드 또는 컴파일러에 의해 생성됐는지 확인)
  - 바이트 코드 수정했을 수 있으므로 검증
  - 클래스 로드 프로세스 중 가장 복잡하고 오랜 시간이 소요
  - 검증에 실패하면 런타임 오류(`java.lang.VerifyError`) 발생

> ##### 예시 검증 요소
> - consistent and correctly formatted symbol table
> - final methods / classes not overridden
> - methods respect access control keywords
> - methods have correct number and type of parameters
> - bytecode doesn`t manipulate stack incorrectly
> - variables are initialized before being read
> - variables are a value of the correct type

##### 1.2.1 Preparation

- 클래스 변수(`static` 변수)와 기본 값에 메모리를 할당하고 초기화 하는 단계
- initializer 나 코드가 실행되지 않음

##### 1.2.2 Resolution (Optional)

- 사용 환경에 따라 동작 여부가 달라진다.
- 타입의 심볼릭 참조를(symbolic references) 직접 참조(direct reference)로 변경된다.
- 참조된 엔티티를 찾기 위해 method area 에서 검색하고 실행된다.

> `new User()` 이 실제 레퍼런스를 가리키지 않는 상태에서   
> 실제 힙에 있는 인스턴스를 가리키는 작업을 이 단계에서 수행한다.


#### 1.3 Initialization

클래스 로딩의 마지막 단계로, 
모든 정적(`static`) 변수는 코드나 `static` 블록 안에서 정의된 값으로 할당되는 단계다. (ex. 클래스 생성자 호출)   
클래스에서는 위에서 아래로, 클래스 계층에서 부모에서 자식으로 한줄씩 실행된다.  

JVM 은 다중 스레드이기 때문에,  
이 단계에서는 동기화를 통해 같은 클래스나 인터페이스를 초기화하지 않도록 방지해야 한다.(`thread safe`) 


### 2. Runtime Data Area

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


## 출처
- [https://d2.naver.com/helloworld/1230](https://d2.naver.com/helloworld/1230)
- [https://asfirstalways.tistory.com/158](https://asfirstalways.tistory.com/158)
- [https://www.baeldung.com/java-classloaders](https://www.baeldung.com/java-classloaders)
- [https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722](https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722)
- [https://www.geeksforgeeks.org/jvm-works-jvm-architecture]([https://www.geeksforgeeks.org/jvm-works-jvm-architecture])
- [https://javatutorial.net/jvm-explained](https://javatutorial.net/jvm-explained)
- [https://dzone.com/articles/jvm-architecture-explained](https://dzone.com/articles/jvm-architecture-explained)
- [https://www.programcreek.com/2013/04/jvm-run-time-data-areas](https://www.programcreek.com/2013/04/jvm-run-time-data-areas)