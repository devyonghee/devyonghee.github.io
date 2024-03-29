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

## JIT(just-in-time) compiler

{% include image.html alt='jit compiler' source_txt='biomedcentral' source='https://bmcbioinformatics.biomedcentral.com/articles/10.1186/s12859-021-04547-0' path="images/theory/jvm-understanding/jit-compiler.png" %}

인터프리터의 성능 문제를 개선하기 위해 JIT 컴파일러가 도입되었다.
JIT 컴파일 방식은 동적 번역(dynamic translation)이라고도 하며, 
즉석으로 해석하는 대신 자주 사용되는 코드를 캐싱하고 변경된 부분만 컴파일한다.

JIT 컴파일러는 먼저 전체 바이트 코드를 native 코드로 컴파일하고 반복적으로 메소드가 호출되면 native 코드를 제공하여 실행된다.  
native 코드는 캐시에 저장되므로 한줄씩 해석하는 인터프리터 방식에 비해 빠르게 실행할 수 있다.

하지만, JIT 컴파일러는 인터프리터가 해석하는 것보다 컴파일하는 데 시간이 많이 소요된다.  
한번만 실행되는 코드라면 오히려 인터프리터 방식이 더 좋을 수 있다. 
그리고 컴파일된 native 코드는 중요한 리소스인 캐시를 사용하게 된다. 
이러한 이유로 JIT 컴파일러는 메소드 호출의 빈도를 확인하여 일정 수준 이상인 경우에만 컴파일을 결정하게 된다. (컴파일 임계치)

- 장점
  - 캐싱된 코드를 사용하기 때문에 인터프리터(interpreter) 방식에 비해 실행 속도 개선

- 단점
  - 실행 시간이 매우 짧은 경우, 컴파일된 코드를 재사용하지도 못하고 프로그램이 끝날 수 있음
  - 런타임에 동적으로 코드를 생성하기 때문에 잠재적인 보안 문제
      - JIT 컴파일러 자체에 버그가 있는 경우 보안 취약점이 될 수 있음

### 컴파일 임계치 (compile threshold)

컴파일 임계치는 JIT 컴파일러가 컴파일을 결정할 기준을 의미한다.  
컴파일 임계치를 만족하면 JIT 컴파일은 해당 코드를 native 코드로 컴파일하여 캐시에 저장한다.

컴파일 임계치는 아래 두 가지를 합친 것을 의미한다.
- 메소드가 호출된 횟수 (method entry counter)
  - CompileThreashold
- 루프를 회전한 횟수 (back-edge loop counter)
  - CompileThreashold * OnStackReplacePercentage / 100
  
어플리케이션을 실행할 때, 다음 VM 옵션을 통해 컴파일 임계치를 설정할 수 있다.
- `XX:CompileThreshold=N` 
- `XX:OnStackReplacePercentage=N`

## AOT(ahead-of-time) Compiler

AOT(ahead-of-time) Compiler 는 JVM 의 실행 시간을 개선한 방법으로,
실행 전에 바이트코드를 native 코드로 컴파일하는 방식이다.
Java9 에서 실험 기능으로 추가되었으며, [JRE-295](https://openjdk.java.net/jeps/295) 에 자세히 설명되어 있다.  

JIT compiler 는 Java 바이트 코드를 실행하고 자주 실행되는 코드를 런타임에 컴파일 하기 때문에 성능 이슈가 있다.  
AOT compiler 는 모두 native 코드로 변경하기 때문에 성능 저하 없이 native 한 성능을 낼 수 있다.  

하지만 AOT compiler 를 사용하면 native 코드로 변경하는 작업도 포함되어야 하기 때문에 빌드 속도가 느리다.  
또한, JIT compiler 에서 사용되는 Hot Reload 기능도 사용할 수 없다.   

### AOT Compile 예시 

```java
public class JaotCompilation {

    public static void main(String[] argv) {
        System.out.println(message());
    }

    public static String message() {
        return "The JAOT compiler says 'Hello'";
    }
}
```

AOT compiler 를 사용하기 전에, Java compiler(`javac`)로 컴파일한다.

```shell
javac JaotCompilation.java
```

자바 컴파일러와 동일한 디렉터리에 존재하고 있는 AOT compiler(`jaotc`) 로 컴파일된 파일(`JaotCompilation.class`)을 다시 컴파일한다.  
다음과 같이 컴파일하게 되면 현재 디렉토리에 `jaotCompilation.so` 이 생성된다. 

```shell
jaotc --output jaotCompilation.so JaotCompilation.class
```

프로그램을 실행하려면 `-XX:AOTLibrary` 인자를 추가하면 된다.
다음과 같이 파일을 직접 지정하거나, `lib` 디렉토리에 추가하여 라이브러리 이름으로 지정할 수 있다.

```shell
java -XX:AOTLibrary=./jaotCompilation.so JaotCompilation
```

## Garbage Collector (GC)

Garbage Collector 는 사용자가 동적으로 할당한 메모리 영역(heap) 중 더이상 사용되지 않는 영역을 자동으로 메모리를 회수하는 프로그램이다.  
생성된 객체가 참조되고 있으면 사용중인 것으로 간주하고, 참조되지 않고 접근이 불가능하면 Garbage Collector 가 메모리를 회수한다.

Garbage Collection 은 일반적으로 JVM 내부에서 자동으로 실행되지만 `System.gc()` 코드를 통해 수동으로 실행할 수도 있다.   
하지만 Garbage Collection 은 stop-the-world 가 발생되어 성능에 영향을 줄 수 있기 때문에 가급적 사용하지 않도록 한다.

Garbage Collector 에 대한 자세한 설명은 다음 글을 참고한다.  
[가비지 컬렉션 (Garbage Collection) 자세히 알아보기](/theory/2022/03/07/garbage-collection/)


## 출처
- [https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722](https://medium.com/platform-engineer/understanding-jvm-architecture-22c0ddf09722)
- [https://junhyunny.github.io/information/java/jvm-execution-engine/](https://junhyunny.github.io/information/java/jvm-execution-engine/)
- [https://www.baeldung.com/ahead-of-time-compilation](https://www.baeldung.com/ahead-of-time-compilation)