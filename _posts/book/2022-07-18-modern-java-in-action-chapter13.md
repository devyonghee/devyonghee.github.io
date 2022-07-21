---
title: '[Modern Java in Action] Chapter13. 디폴트 메서드'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 13장에서는 디폴트 메서드에 대해 소개하고 있다.   
디폴트 메서드가 무엇인지, 기존의 문제를 어떻게 디폴트 메서드를 이용하여 어떻게 해결하는지 알아본다.


<!--more-->

기존에는 인터페이스가 변경되면 상속받은 모든 클래스의 수정이 필요했다.     
하지만 자바 8에서는 인터페이스 내부의 정적 메서드, 기본 구현을 제공하는 디폴트 메서드로 이 문제를 해결했다.  
디폴트 메서드를 이용하면 기본 구현을 그대로 상속하므로 호환성을 유지하면서 라이브러리를 자유롭게 변경할 수 있다.  
또한 디폴트 메서드는 다중 상속 동작이라는 유연성을 제공해주기 때문에 유용하게 사용할 수 있다.


<br/>

## 13.1 변화하는 API 

예제를 통해 릴리즈된 인터페이스가 수정되었을 때 발생되는 문제에 대해 자세히 알아본다.

### 버전 1

```java 
public interface Resizable extends Drawable {
  int getWidth();
  int getHeight();
  void setWidth(int width);
  void setHeight(int height);
  void setAbsoluteSize(int width, int height);
}

// implments
public Ellipse implements Resizeable {
    ...
}
```

### 버전 2

```java 
public interface Resizable {
  int getWidth();
  int getHeight();
  void setWidth(int width);
  void setHeight(int height);
  void setAbsoluteSize(int width, int height);
  // 신규 메서드
  void setRelativeSize(int wFactor, int hFactor);
}
```

새로운 메서드가 추가되면 바이너리 호환성(추가된 메서드를 호출하지 않으면 잘 동작)은 유지 된다.
하지만 다음과 같은 문제들이 발생된다.

- 메서드를 사용한다면 `AbstractMethodError` 런타임 에러가 발생
- 애플리케이션을 재빌드하면 컴파일 에러 발생

이를 해결하기 위해 예전 버전과 새로운 버전을 직접 관리하는 방법도 있지만 다음과 같은 문제가 있다.

- 라이브러리 관리 복잡
- 사용자는 같은 코드에 두가지 라이브러리를 모두 사용해야 함


<br/>

## 13.2 디폴트 메서드란 무엇인가?

디폴트 메서드는 호환성을 유지하하면서 API를 변경할 수 있는 자바 8의 새로운 기능이다.  
`default` 키워드로 시작하며, 인터페이스를 구현한 클래스에서 구현하지 않은 메서드가 존재하면 인터페이스 자체에서 제공하게 된다.

```java 
public interface Size {
    int size();
    default boolean isEmpty() {
        return size() == 0;
    }
}

// Fix Resizable
default void setRelativeSize(int wFactor, int hFactor) {
    setAbsoluteSize(getWidth() / wFactor, getHeight() / hFactor);
} 
```


### 추상 클래스와 인터페이스 차이

- 추상 클래스
  - 클래스가 하나의 추상 클래스만 상속 가능
  - 인스턴스 변수로 공통 상태를 가짐
- 인터페이스
  - 클래스가 여러 개 인터페이스 구현 가능
  - 인스턴스 변수를 가질 수 없음


<br/>

## 13.3 디폴트 메서드 활용 패턴

디폴트 메서드를 활용하는 방식 선택형 메서드, 동작 다중 상속을 소개한다.

### 선택형 메서드(optional method)

클래스에서 메서드의 기능이 필요없는 경우, 디폴트 메서드를 이용하면 기본 구현을 제공할 수 있으므로 클래스에서 빈 구현을 제공할 필요가 없다.  
자바 8의 `Iterator` 인터페이스는 `remove` 메서드를 다음과 같이 정의한다.

```java 
interface Iterator<T> {
    boolean hasNext();
    T next();
    default void remove() {
        throw new UnsupportedOperationException();
    }
}
```


### 동작 다중 상속(multiple inheritance of behavior)

디폴트 메서드를 이용하면 동작 다중 상속 기능 구현이 가능해서 기존 코드를 재사용할 수 있다.   

```java 
public class ArrayList<E> extends AbstractList<E>
    implements List<E>, RandomAccess, Cloneable, Serializable {
}
```

