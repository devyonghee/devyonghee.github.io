---
title: '[Modern Java in Action] Chapter3. 람다 표현식'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 3장에서는 자바 8의 새로운 기능인 람다 표현식에 대해 소개한다.
람다 표현식을 어떻게 만들고, 사용하여 코드를 간결하게 만드는지 자세히 알아보도록 한다. 

<!--more-->

<br/>

## 3.1 람다란 무엇인가?

람다 표현식은 메서드로 전달할 수 있는 익명 함수를 단순화 한 것이다.  

### 람다 특징
- 익명
  - 보통 메서드와 달리 이름이 없음
  - 구현할 코드에 대해 걱정거리 감소
- 함수
  - 특정 클래스에 종속되지 않으므로 함수라고 부름
  - 메서드처럼 파라미터 리스트, 바디, 반환 형식, 가능한 예외리스트는 포함
- 전달
  - 람다 표현식을 메서드 인수로 전달하거나 변수로 저장
- 간결성
  - 익명 클래스처럼 많은 코드가 필요하지 않음

### 람다 구성

``` java 
//       람다 파라미터       // 화살표 //               람다 바디                      // 
(Apple apple1, Apple apple2) -> apple1.getWeight().compareTo(apple2.getWeight());    
```

- 람다 파라미터
  - 메서드 파라미터 (`apple1`, `apple2`)
- 화살표 (`->`)
  - 람다 파라미터와 람다 바디를 구분
- 람다 바디
  - 람다의 반환 값에 해당하는 표현식

### 람다 기본 문법

- 표현식 스타일(expression style) : `(parameters) -> expression`
- 블록 스타일(block style) : `(parameters) -> { statements; }`


<br/>

## 3.2 어디에, 어떻게 람다를 사용할까?

### 함수형 인터페이스

함수형 인터페이스란 하나의 추상메서드만 지정하는 인터페이스를 의미한다.  
`Predicate<T>`, `Comparator`, `Runnable` 등이 바로 함수형 인터페이스다.  
**람다 표현식**은 추상 메소드의 구현을 직접 전달하므로 **함수형 인터페이스의 인스턴스**로 취급한다.

```java 
public interface Predicate<T> {
    boolean test (T t);
}
```

> #### @FunctionalInterface
> `@FunctionalInterface` 은 함수형 인터페이스임을 의미하는 애노테이션이다.  
> 이 애노테이션을 추가했는데 추상 메서드가 한 개 이상이라면 컴파일 에러가 발생된다. 

### 함수 디스크립터 (function descriptor)

함수 디스크립터는 람다 표현식의 시그니처(signature)를 서술하는 메서드를 의미한다. 

#### Example
- `() -> void `
  - 파라미터가 없으며, `void` 를 반환하는 함수를 의미
- `(Apple, Apple) -> int`
  - 두 개의 Apple 을 인수로 받아 int 반환하는 함수를 의미


## 3.3 람다 활용 : 실행 어라운드 패턴 (execute around pattern)

{% include image.html alt="execute around pattern" source_txt='모던 자바 인 액션' path="images/book/modern-java-in-action/execute-around-pattern.png" %}

실용적인 예제를 통해 람다를 활용하여 유연하고 간결한 코드를 구현하는 방법에 대해 알아본다.  
대부분 자원을 처리하는 곳에서 설정과 정리하는 과정은 비슷하다.  
이렇게 실제 작업하는 코드가 설정과 정리 사이에 위치된 코드를 **실행 어라운드 패턴**(execute around pattern)이라고 한다.  

```
public String processFile() throws IOException {
    try (BufferedReader br = 
            new BuffueredReader(new FileReader("data.txt"))) {
        return br.readLine(); // 실제 작업하는 코드
    }
}
```

위 코드를 람다와 동작 파라미터로 유연하고 간결한 코드가 되도록 수정한다.  
위에서 한 행을 읽던 부분이 두 행도 읽어야 한다는 상황을 가정한다.
동작을 파라미터화하여 전달하기 위해 함수형 인터페이스를 정의하고 `processFile` 메서드 인수를 변경한다. 

```java 
@FunctionalInterface
public interface BufferedReaderProcessor {
    String process(BufferedReader b) throws IOException;
}

public String processFile(BufferedReaderProcessor p) throws IOException {
    ....
}
```

람다 표현식으로 추상 메서드 구현이 전달되었으니, 
`processFile` 메서드 바디 내에서 `BufferedReaderProcessor` 의 `prcess` 를 호출하도록 한다.

```java 
public String processFile() throws IOException {
    try (BufferedReader br = 
            new BuffueredReader(new FileReader("data.txt"))) {
        return p.process(br); // 객체 처리
    }
}
```

이제 람다를 이용해서 `processFile` 메서드에서 다양한 동작을 수행할 수 있다. 

```java
processFile((BufferedReader br) -> br.readLine());
processFile((BufferedReader br) -> br.readLine() + br.readLine());
```

## 3.4 함수형 인터페이스 사용

함수형 인터페이스의 추상 메서드 시그니처를 함수 디스크립터라고 한다.  
람다 표현식을 다양하게 사용하려면 공통 함수 디스크립터를 기술하는 함수형 인터페이스 집합이 필요하다.  
자바 8 에서는 이를 위해 `jaava.util.function` 패키지로 다양한 함수형 인터페이스를 제공하고 있다. 

### Predicate

`java.util.function.Predicate<T>` 는 제네릭 형식의 `T` 객체를 인수로 받아 불리언을 반환하는 `test` 메소드를 정의한다.  
자바독 명세를 보면 `and`, `or` 같은 메서드도 존재한다.

```java 
@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t);
}

Predicate<String> nonEmptyStringPredicate = (String s) -> !s.isEmpty();
```

### Consumer

`java.util.function.Consumer<T>` 인터페이스는 `T` 객체를 받아서 `void` 를 반환하는 `accept` 메소드를 정의한다.  


```
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}

Consumer<Integer> c = (Integer i) -> System.out.println(i);
```

### Function

`java.util.function.Function<T, R>` 인터페이스는 제네릭 형식 `T` 객체를 받아 `R` 객체를 반환하는 `apply` 메서드를 정의한다.  

```java  
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}

Function<String, Integer> f = (String s) -> s.length();
```

### 기본형 특화

자바의 모든 형식은 참조형(reference type) 또는 기본형(primitive type)으로 이루어져 있다.  
제네릭 파라미터에는 참조형만 사용 가능하기 때문에 기본형은 박싱(boxing) 기능을 이용하여 참조형으로 변환해서 사용해야 한다.  
하지만 박싱된 값은 힙에 저장하여 메모리를 더 사용하게 되며, 가져올 때도 메모리를 탐색하게 되기 때문에 비용이 추가된다.  
이러한 과정을 피할 수 있도록 자바에서는 특화된 함수형 인터페이스를 제공한다.

| 함수형 인터페이스           | 함수 디스크립터          | 기본형 특화                                                                                         | 
|---------------------|-------------------|------------------------------------------------------------------------------------------------|
| Predicate<T>        | T -> boolean      | IntPredicate<br/>LongPredicate<br/>DoublePredicate                                             |
| Consumer<T>         | T -> void         | IntConsumer<br/>LongConsumer<br/>DoubleConsumer                                                |
| Function<T, R>      | T -> R            | IntFunction<R><br/>IntToDoubleFunction<br/>IntToLongFunction<br/>LongFunction<R><br/>...       |
| Supplier<T>         | () -> R           | BooleanSupplier<br/>IntSupplier<br/>LongSupplier<br/>DoubleSupplier                            |
| UnaryOperator<T>    | T -> T            | IntUnaryOperator<br/>LongUnaryOperator                                                         |
| BinaryOperator<T>   | (T, T) -> T       | IntBinaryOperator<br/>LongBinaryOperator<br/>DoubleBinaryOperator                                 |
| BiPredicate<L, R>   | (T, U) -> boolean |                                                                                                |
| BiConsumer<T, U>    | (T, U) -> void    | ObjInConsumer<T><br/>ObjLongConsumer<T><br/>ObjDoubleConsumer<T>                                     |
| BiFunction<T, U, R> | (T, U) -> R       | ToIntBiFunction<T, U><br/>ToLongBiFunction<T, U><br/>ToDoubleBiFunction<T, U>                          |


## 3.5 형식 검사, 형식 추론, 제약

### 형식 검사

람다가 사용되는 콘텍스트(context, 전달 될 메서드 파라미터나 변수 등)를 이용해서 람다의 형식을 추론한다.  
콘텍스트에서 기대하고 있는 람다 표현식을 **대상 형식**(target type)이라고 한다.  

#### 형식 검사 과정

```java 
filter(inventory, (Apple a) -> a.getWeight() > 150);
```

1. `filter` 메서드의 선언 확인
2. 메서드에서 두번째 파라미터로 `Predicate<Apple>` 대상 형식을 기대
3. `Predicate<Apple>`은 한 개의 추상 메서드를 정의한 함수형 인터페이스인지 확인
4. `test` 메서드가 `Apple` 인수로 받아 `boolean`을 반환하는 함수 디스크립터 확인
5. 함수 디스크립터와 람다(메서드로 전달된 인수)의 시그니처가 같은지 확인


### 같은 람다, 다른 함수형 인터페이스

대상 형식(target type)이라는 특성 때문에 같은 람다 표현식이어도 다른 함수형 인터페이스로 사용될 수 있다.  
아래 할당문들은 모두 유효한 코드이다.

```java
Callable<Integer> c = () -> 42;
PrivilegeAction<Integer> p = () -> 42;

Comparator<Apple> c1 =                (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());
ToIntBiFunction<Apple, Apple> c2 =    (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());
BiFunction<Apple, Apple, Intger> c3 = (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());
```

### 형식 추론

컴파일러는 대상 형식(target type)을 통해 함수 디스크립터를 파악하고 람다의 시그디처를 추론할 수 있다.  
그러므로 파라미터 형식을 추론할 수 있기 때문에 람다 문법에서 이를 생략할 수 있다.

```java 
List<Apple> greenApples = filter(inventory, apple -> GREEN.equals(apple.getColor()));
Comparator<Apple> c = (a1, a2) -> a1.getWeight().compareTo(a2.getWeight());
```

### 지역 변수 사용

람다 표현식에서는 인수 뿐만 아니라 람다 캡처링(capturing lambda)을 통해 외부에서 정의된 변수인 **자유 변수**(free variable)도 활용할 수 있다.  

```java 
int portNumber = 123;
Runnable r = () -> System.out.println(portNumber);
```

하지만 자유 변수를 사용하기 위해서는 지역 변수는 `final` 선언이 되어 있거나 `final` 변수와 비슷하게 사용되어야 한다.   
한번만 활당할 수 있는 지역 변수여야 한다는 것이다.  
지역 변수는 스택에 저장되는데 스레드가 종료되면 변수 할당이 사라질 수 있기 때문에 람다에는 복사본의 값이 전달된다.  
복사된 값은 변경되지 않아야 하기 때문에 한번만 할당되어야 한다는 제약이 필요한 것이다.


## 3.6 메서드 참조

메서드 참조를 이용하면 기존의 메서드를 람다처럼 가독성이 좋고 자연스럽게 전달할 수 있다.  
메서드 참조는 메서드명 앞에 구분자(`::`)를 붙여서 활용할 수 있다. 

```java 
(Apple apple) -> apple.getWeight();  Apple::getWeight;
```

| 람다                                                       | 메서드 참조 단축 표현        |
|----------------------------------------------------------|---------------------|
| `(Apple apple) -> apple.getWeight();  Apple::getWeight;` | `Apple::getWeight`  |
| `(str, i) -> str.substring(i)`                           | `String::substring` |
| `this.isValidName(s)`                                    | `this::isValidName` |

### 메서드 참조 유형

- 정적 메서드 참조
  - `Integer.parseInt()` 메서드는 `Integer::parseInt` 로 표현
- 다양한 형식의 인스턴스 메서드 참조
  - `String`의 `length` 메서드는 `String::lenght` 로 표현
- 기존 객체의 인스턴스 메서드 참조
  - `expensiveTransaction` 지역 변수의 `getValue` 메서드는 `expensiveTransaction::getValue` 로 표현

### 생성자 참조

정적 메서드의 참조를 만드는 방법과 비슷하게 `ClassName::new` 처럼 `new` 키워드로 생성자의 참조를 만들 수 있다.  
아래 두 코드는 동일한 동작을 하는 코드이다.

``` java
Supplier<Apple> c1 = () -> new Apple();
Supplier<Apple> c2 = Apple::new;
```