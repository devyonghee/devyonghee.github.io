---
title: '[Design Pattern] 템플릿 메소드 패턴(Template Method Pattern)'
tags: [design-pattern, template-method-pattern]
categories: code
---

템플릿 메소드 패턴(Template Method Pattern)은 특정 작업 일부분을 서브 클래스로 위임하는 패턴이다.  
GoF(Gang of Four) Design Pattern 에서 행위(behavioral) 패턴에 속하는 패턴이다.

<!--more-->

템플릿 메소드 패턴(Template Method Pattern)은 서브 클래스에서 특정 로직을 구현하여 골격을 정의한다.  
이 패턴을 이용하면 로직의 일부분을 캡슐화하여 구조를 변경하지 않고 특정 단계를 구현할 수 있다.  

전체적인 구조를 상위 클래스에서 정의하면서,   
동작이 다른 부분을 하위 클래스에서 구현하기 때문에 전체적인 구조를 재사용하는데 용이하다.

## 구조 

{% include image.html alt="template method pattern" path="images/code/template-method-pattern/structure.png" %}

- AbstractClass
  - 템플릿 메서드를 정의하는 클래스
  - 하위 클래스에서 수행 할 공통 알고리즘 정의
  - 하위 클래스에서 구현되어야 하는 기능을 추상 메서드로 정의

- ConcreteClass
  - 추상 메서드를 구현하는 클래스
  - 상위 클래스에서 정의된 알고리즘에 구현된 메서드가 적절하게 수행

## 장점

- 추상 클래스에서 공통된 코드를 정의하므로 중복 코드 제거 가능
- 하위 클래스는 자신의 로직만 구현하면 되므로 관리가 용이
- 새로운 로직이 필요해면 새로운 클래스를 정의하면 되므로 확장이 용이

## 단점

- 많은 클래스가 생성될 수 있음
- 자식 클래스에서 부모 클래스를 상속받고 있기 때문에 의존성이 발생

## 구현

### 일반

#### AbstractClass

```java 
public abstract class CaffeineBeverage {

    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }

    abstract void brew();

    abstract void addCondiments();

    void boilWater() {
        System.out.println("Boiling water");
    }

    void pourInCup() {
        System.out.println("Pouring into cup");
    }
} 
```


#### ConcreteClass

```java 
public class Coffee extends CaffeineBeverage {

    void brew() {
        System.out.println("Dripping Coffee through filter");
    }

    void addCondiments() {
        System.out.println("Adding Sugar and Milk");
    }
}
```

```java 
public class Tea extends CaffeineBeverage {

    void brew() {
        System.out.println("Steeping the tea");
    }

    void addCondiments() {
        System.out.println("Adding Lemon");
    }
}
```


### 후크(hook) 활용

#### AbstractClass

```java 
public abstract class CaffeineBeverageWithHook {

    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        if (customerWantsCondiments()) {
            addCondiments();
        }
    }

     abstract void brew();

     abstract void addCondiments();

    void boilWater() {
        System.out.println("Boiling water");
    }

    void pourInCup() {
        System.out.println("Pouring into cup");
    }

    boolean customerWantsCondiments() {
        return true;
    }
}
```

#### ConcreteClass

```java 
public class CoffeeWithHook extends CaffeineBeverageWithHook {

    private static final Scanner scanner = new Scanner(System.in);

    void brew() {
        System.out.println("Dripping Coffee through filter");
    }

    void addCondiments() {
        System.out.println("Adding Sugar and Milk");
    }

    public boolean customerWantsCondiments() {
        return userInput().toLowerCase().startsWith("y");
    }

    private String userInput() {
        System.out.print("Would you like milk and sugar with your coffee (y/n)? ");
        return Optional.ofNullable(scanner.next())
                .orElse("no");
    }
}
```

```java 
public class TeaWithHook extends CaffeineBeverageWithHook {

    private static final Scanner scanner = new Scanner(System.in);

    protected void brew() {
        System.out.println("Steeping the tea");
    }

    protected void addCondiments() {
        System.out.println("Adding Lemon");
    }

    public boolean customerWantsCondiments() {
        return userInput().toLowerCase().startsWith("y");
    }

    private String userInput() {
        System.out.print("Would you like lemon with your tea (y/n)?");
        return Optional.ofNullable(scanner.next())
                .orElse("no");
    }
}
```

전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/templatemethod) 참고

## 출처

- Head First Design Patterns