---
title: 이펙티브 자바 Chapter5. 제네릭
tags: [book, effective-java]
categories: book
---


이펙티브 자바 5장 제네릭에 대해서 설명하고 있다.  
이전에는 런타임에 형변환 오류가 나곤 했는데 제네릭을 통해 컴파일 과정에서 방지할 수 있다.   

<!--more-->

<br/>

## 아이템 26. 로 타입은 사용하지 말라

> 로타입 : 제네릭 타입에서 타입 매개변수를 사용하지 않음 (ex. `List<E>`의 로타입은 `List`)

- 로타입은 제네릭이 주는 안전성과 표현력 상실 (호환성 때문에 지원)
  - 컬렉션에 다른 타입을 넣어도 컴파일되고 실행
  - `List<Object>` 는 제네릭 하위 타입 규칙으로 괜찮다. (`List<String>` 이 `List<Object>` 하위 타입이 아님)
  - 실제 타입 매개변수를 신경쓰고 싶지 않다면 와일드 카드 타입(`<?>`) 사용 (`Collection<?>` 에는 `null` 외의 어떤 원소도 추가 불가)

- 로타입 사용 예외
  - `class` 리터럴에 로타입 사용 (ex. `List.class`, `String[].class`, `int.class`)
  - `instanceof` 연산자 사용할 때 와일드 카드는 아무 역할 없어 지저분해지므로 로타입 사용 (ex. `o instanceof Set`)

<br/>

## 아이템 27. 비검사 경고를 제거하라

비검사 경고는 런타임중 `ClassCastException` 일으킬 수 있는 잠재적 가능성을 나타내므로 최대한 제거하라

- 경고를 제거할 수 없지만 타입 안전하다고 확신한다면 `@SuppressWarnings("unchecked")` 달아 경고 숨기자
  - 가능하면 `@SuppressWarnings("unchecked")` 범위는 좁은 범위
  - `return` 문제 필요하다면 메소드에 추가하지말고 지역 변수 선언하여 반환
  - `@SuppressWarnings("unchecked")` 사용한다면 경고를 무시해도 되는 이유를 주석으로 남기자
  
<br/>

## 아이템 28. 배열보다는 리스트를 사용하라

배열은 런타임 에러 발생할 수 있음  
리스트를 사용하여 타입 안전성과 상호운용성 향상

- 배열은 공변 (특정 클래스의 하위 타입이라면 배열도 하위 타입)  
  제너릭은 불공변 (다른 타입은 서로 하위 타입도 상위 타입도 아님)
  ```java
  Object[] objectArray = new Long[1];
  objectArray[0] = "넣기 불가능"  //ArrayStoreException 런타임 에러
  
  List<Object> ol = new ArrayList<Long>(); //컴파일 에러
  ```
  
- 배열은 실체화 (런타임에도 자신이 담아야하는 원소 타입을 인지)  
  제네릭은 런타임에 소거 (컴파일 타임에만 원소 타입 검사)

<br/>

## 아이템 29. 이왕이면 제네릭 타입으로 만들라

새로운 타입을 설계할 때 형변환 없이 사용할 수 있도록 하라

- 모호한 타입(ex. `Object`)으로 데이터를 관리하면 클라이언트에서 형변환하면서 런타임 오류가 날 위험이 있다.
  - 제네릭으로 만들어도 클라이언트에는 문제가 되지 않는다.

- 제네릭 배열 생성 오류 해결 방법
  - `(E[]) new Object[CAPACITY]` 
    - 코드가 더 짧음  코드가 더 짧음, 가독성이 더 좋음
    - 런타임이 컴파일타임 타입과 달라 힙 오염 발생 (아이템 32)
  - `E[]` → `Object[]`
    - 원소를 읽을 때마다 형변환 필요
    - 힙 오염 방지  

두가지 방법 모두 일반적으로 타입 안전하지 않지만 확실하게 관리되고 있다면 `@SuppressWarnings` 선언


<br/>

## 아이템 30. 이왕이면 제네릭 메서드로 만들라

제네릭을 이용하면 직접 형변환 하지 않아도 오류 없이 컴파일된다.
메서드도 안전하게 사용할 수 있도록 형변환 없이 사용하는 편이 좋다.

### 제네릭 싱글턴 팩터리
불변 객체를 여러 타입으로 활용할 필요가 있다. (ex. `Collections.reverseOrder`, `Collections.emptySet`)  
항등 함수의 경우 다음과 같이 제네릭 싱글턴 팩터리 패턴을 사용할 수 있다.
```java 
private static UnaryOperator<Object> IDENTITY_FN = (t) -> t;

@SuppressWarnings("unchecked")
public static <T> UnaryOperator<T> identityFunction(){
    return UnaryOperator<T> IDENTITY_FN;
}
```

### 재귀적 타입 한정

자기 자신이 들어간 표현식을 사용하여 타입 매개변수 허용 범위 한정  
주로 순서를 정하는 `Comparable` 인터페스와 함께 사용  
```java
public static <E extends Comparable<E>> E max(Collections<E> c);
```

<br/>

## 아이템 31. 한정적 와일드카드를 사용해 API 유연성을 높이라

매개 변수화 타입은 불공변(invariant) → `List<String>`은 `List<Object>` 하위 타입이 아님  
불공변 방식보다 유연한 상황이 필요할 수 있음  

유연성을 극대화하려면 원소의 생산자나 소비자용 입력 매개변수에 와일드 카드 타입 사용하라  
하지만 생산자와 소비자 역할을 동시에 한다면 와일드 카드 타입 쓰지 말자

> 펙스(PECS) : producer-extends, consumer-super

### 생산자(producer)

```java
public void pushAll(Iterable<E> src) {
    for (E e : src) {
        push(e);
    }
}

Statck<Number> numberStatck = new Stack<>();
Iterable<Integer> integers = ...?
numberStack.pushAll(integers);  // 오류 발생
```

와일드 카드를 이용해 `extends` 추가

```java
public void pushAll(Iterable<? extends E> src) {
    for (E e : src) {
        push(e);
    }
} 
```

### 소비자(consumer)

```java
public void popAll(Collection<E> dst) {
    while (!isEmpty()) {
        dst.add(pop());
    }
}

Statck<Number> numberStatck = new Stack<>();
Collection<Object> objects = ...?
numberStack.popAll(objects);  // 오류 발생
```

와일드 카드 이용해 `super` 추가
```java
public void popAll(Collection<? super E> dst) {
    while (!isEmpty()) {
        dst.add(pop());
    }
}
```

### 메서드 선언

메서드 선언에 타입 매개 변수가 한 번만 나오면 와일드 카드로 대체하라  
신경 써야 할 타입 매개변수도 없어서 편리

```java
public static <E> void swap(List<E> list, int i, int j);
public static void swap(List<?> list, int i, int j);  // 이 방식이 더 좋다


public static void swap(List<?> list, int i, int j) {
    swapHelper(list, i, j)
}

// 와일드 카드에서는 꺼낸 객체를 다시 넣어줄 수 없기 때문에 실제 타입을 알려주는 도우미 메서드가 필요 
private static <E> void swapHelper(List<E> list, int i, int j) {
    list.set(i, list.set(j, list.get(i)));
}
```

<br/>

## 아이템 32. 제네릭과 가변인수를 함께 쓸 때는 신중하라

가변인수를 사용하면 내부에 감춰야할 배열이 클라이언트에게 노출되어 제네릭이나 매개변수화 타입이 포함되면 컴파일 에러가 발생된다.
그래서 제네릭 가변인수(varargs) 배열 매개변수에 값을 저장하는 것은 안전하지 않다.

타입안전한지 확인하고 제네릭이나 매개변수화 타입의 varargs 매개변수를 받는 모든 메서드에 `@SafeVarargs` 달자  
하지만 다음 두가지 조건을 어긴다면 수정해야 한다.
- varargs 매개변수 배열에 아무것도 저장하지 않는다.
- 배열을 신뢰할 수 없는 코드에 노출하지 않는다.

<br/>

## 아이템 33. 타입 안전 이종 컨테이너를 고려하라

### 타입 안전 이동 컨테이너 패턴(type safe heterogeneous container pattern)  

컨테이너 대신 키를 매개변수화한 다음, 컨테이너에 값을 넣거나 뺄때 매개변수화한 키를 함께 제공
```java
public class Favorites {
    private Map<Class<?>, Object> favorites = new HashMap<>();    

    public <T> void putFavorite(Class<T> type, T instance) {
        favorites.put(Objects.requireNonNull(type), instance);
    }
    public <T> T getFavorite(Class<T> type) {
        return type.cast(favorites.get(type));
    }
}
```

- `Favorites` 제약
  - `Class`객체를 제네릭이 아닌 로타입으로 넘기면 안전성이 깨짐 (ex. `f.putFavorite((Class) Integer.class, "인스턴스")`)
  - 실체화 불가 타입에는 사용할 수 없음 (ex. `List<String>`)
    - **슈퍼 타입 토큰** 으로 해결하려는 시도가 있다. (ex. `new TypeRef<List<String>>(){}`)

