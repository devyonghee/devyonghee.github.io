---
title: 코드 스피츠 Object83 4회차 정리
tags: [study, book, object, OOP]
categories: study
---

실제로 리스코프 치환 원칙(LSP) 지켜지는 것이 힘들다.  
다양한 역할로 나누어질 경우 최대한 client 쪽으로 밀어내면서 **type**으로 해결하자

<!--more-->

> 강의 시작 전에 '개발자가 반드시 알아야할 객체 지향과 디자인 패턴' 책을 추천한다. 
> 얇은 분량으로 코드 실무적으로 자세하게 적은 책이라고 한다.


우리는 보통 객체 설계할 때, 다른 객체에게 물어보고 동작을 수행도록 한다.
이러한 이유로 기차 폭주 사건을 일으키게 되고 이용되는 객체가 변화하면 반드시 영향이 미친다. 
그래서 결국 객체 지향에 실패한다.  
물어보지 않고 명령(Tell Don`t Ask) 하도록 하면 이러한 영향을 줄일 수 있고 디미터의 원칙도 달성할 수 있다.

**디미터의 원칙**과 **Tell Don't Ask(Hollywood 원칙)** 같은 원칙들은 수정에 강한 코드를 만들 수 있게 한다.
**SOLID** 원칙에서 **OCP** 와 **LSP** 가 이 두 원칙과 밀접한 관계를 가진다. 
**OCP**, **LSP** 를 지키려면 **Hollywood 원칙**을 사용할 수 밖에 없다.

## LSP (리스코프 치환 원칙) 에 대해 다시 한번 생각해보자

**LSP**은 자식형을 부모형으로 안전하게 치환할 수 있다라는 원칙이다.
당연한 내용이지만 실제로 개발을 하려고 하면 잘 지켜지지 않는다.
  
{% include image.html alt="hasty-abstract1" path="/images/study/code-spitz/hasty-abstract.jpg" %}

`concreate1`, `concreate2` 클래스를 만들었는데 a b c 메소드라는 공통점이 있어서 추상화를 했다.
추상층 a b c 를 만들고 구상층을 만들 수 있다.
하지만 `concreate3` 도 같은 구상층이 생긴다면 c 의 책임을 주려고한다.

{% include image.html alt="hasty-abstract2" path="/images/study/code-spitz/hasty-abstract2.jpg" %}

그래서 위와 같이 fake C()를 만들어 버린다.
여기서 `concreate3` 같은 추상층에 존재하면 안되지만 억지로 그 역할을 수행하려고 하는 것이다.
이런 경우, 리스코프 치환 원칙을 어기게 되며 **성급한 추상화**를 했다고 한다. 
성급한 추상화로 인해 `runtime error`, `compile error` 보다 더 심각한 `context error `가 발생 한다.


{% include image.html alt="hasty-abstract3" path="/images/study/code-spitz/hasty-abstract3.jpg" %}

리스코프 치환 원칙을 지키기 위해서 fake C()를 만들지 말고 새로운 추상층을 만들어야 한다.
이러면 우리는 안전하게 리스코프 치환 원칙을 준수할 수 있다.
리스코프 치환 원칙은 기존 보다 기능이 감소하면 어렵지 않은 방법으로 지켜낼 수 있다. 하지만 반대의 경우에는 어떻게 될 것인가

{% include image.html alt="hasty-abstract4" path="/images/study/code-spitz/hasty-abstract4.jpg" %}


`concreate3`에 d 가 생겼다고 가정했다.   
리스코프 치환 원칙을 위배하지는 않았지만 d 를 사용하는 방법을 찾기가 어렵다.
그래서 다운 캐스팅을 하게 된다.  
**리스코프 치환 원칙**을 지키려고 다운 캐스팅을 하지 않으려고 했지만 d를 사용하기 위해서는 다운캐스팅을 하는 방법밖에 떠오르지 않는다.
그래서 다운캐스팅을 사용하니까 **리스코프 치환원칙**을 지켜지지 않고 자동으로 **OCP** 를 어기게 된다. 

{% include image.html alt="hasty-abstract5" path="/images/study/code-spitz/hasty-abstract5.jpg" %}

그래서 우리는 `Generic` 을 이용하여 확장이 일어날때 **리스코프 치환 원칙**을 지키는 방법을 찾는다.

## 개발자의 세계 (코드)

{% include image.html alt="programmer-world" path="/images/study/code-spitz/programmer-world.jpg" %}


`Director` 는 `Paper`(기획서)를 받고, `Paper` 는 `ServerClient` 와 `Client` 로 만드는 사양서로 이루어져 있다.  
이 프로젝트를 수행하는 `Frontend`, `Backend Programmer` 가 있고 `Programmer` 는 `Paper` 를 알아야만 개발을 할 수 있으므로 아는 관계여야 한다. 

 

```java 

public interface Paper {
}

```

형으로만 추상하기 위해 메소드가 없는 `Paper` 만들었다.

```java 

public interface Programmer {
    Program makeProgram(Paper paper);
}

```

`Programmer`는 `Director`에게 `Paper`를 제공 받아 `Program`으로 모델링 하는 메소드가 필요하다.
그래서 `Programmer`는 `Program`을 만드는 인터페이스를 외부에 제공한다.

> 모델링 : 복잡한 현실세계를 숨기고 목적에 맞게 필요한 것만 추려내는 것


```java  

public class Client implements Paper {
    Library library = new Library("vueJS");
    Language language = new Language("kotlinJS");
    Programmer programmer;

    public void setProgrammer(Programmer programmer) {
        this.programmer = programmer;
    }
}


```

`Client` 는 marker interface 인 `Paper` 기반으로 구현한 것이다.
`Client` 에는 library 와 language 이라는 사양서가 있고 `Programmer` 도 필요하다.


```java 

public class ServerClient implements Paper {
    Server server = new Server("test");
    Language backEndLanguage = new Language("java");
    Language frontEndLanguage = new Language("kotlinJS");

    private Programmer backEndProgrammer;
    private Programmer frontEndProgrammer;

    public void setBackEndProgrammer(Programmer programmer) {
        this.backEndProgrammer = programmer;
    }

    public void setFrontEndProgrammer(Programmer programmer) {
        this.frontEndProgrammer = programmer;
    }
}

```

서버클라이언트에는 `server`, `backEndLanguage`, `frontEndLanguage` 사양이 있고
그에 맞는 backEndProgrammer, frontEndProgrammer 가 필요하다.

```java 

public class FrontEnd implements Programmer {
    private Language language;
    private Library library;

    @Override
    public Program makeProgram(Paper paper) {
        if (paper instanceof Client) {
            Client pb = (Client) paper;
            language = pb.language;
            library = pb.library;
        }
        return makeFrontEndProgram();
    }

    private Program makeFrontEndProgram() {
        return new Program();
    }
}

```

`Frontend` 개발자는 `language` 와 `library` 의 사양을 받아서 프로그램을 만든다.
그런데 `Paper` 가 maker interface 이기 때문에 `language` 와 `library` 사양을 가져올 수 없다.
정보를 받기 위해 `Client` 로 다운캐스팅을 하게 되지만 결국 **LSP** 와 **OCP** 를 어기게 된다.

또한, `Paper`가 `Client` 일 경우도 이외에 더 많은 `Paper` 의 구상형이 생길 수록 `FrontEnd` 의 코드를 수정 해야 하는 문제점도 생긴다.


```java 

public class BackEnd implements Programmer {
    private Server server;
    private Language language;

    @Override
    public Program makeProgram(Paper paper) {
        if (paper instanceof ServerClient) {
            ServerClient pa = (ServerClient) paper;
            server = pa.server;
            language = pa.backEndLanguage;
        }
        return makeFrontEndProgram();
    }

    private Program makeFrontEndProgram() {
        return new Program();
    }
}


```

`BackEnd` 도 비슷하다. 
여기서도 `Client` 로 받을 경우의 처리가 존재하지 않는다. 
마찬가지로 `LSP`와 `OCP`를 어기고 있다. 
`BackEnd` 도 `Paper` 의 구상형을 만들때 마다 영향을 받으니 구상형을 추가하는 것이 어려워진다.
결국, 모든 `Programmer`의 구상형을 찾아서 `Paper`의 구상형 처리를 추가 해야 되는 문제가 생긴다.
`if` 나 `switch`를 사용하면 Runtime 중에 흐름 분기를 맡기게 되는 셈인데, 이러면 정적타입의 안정성을 잃어버리게 된다.
가능하면 코드에서 `if` 나 `switch` 를 제거하고 형으로 구분 해야 한다. 


```java 

public class Director {
    private Map<String, Paper> projects = new HashMap<>();

    public void addProject(String name, Paper paper) {
        projects.put(name, paper);
    }

    public void runProject(String name) {
        if (!projects.containsKey(name)) throw new RuntimeException("no project");
        Paper paper = projects.get(name);
        if (paper instanceof ServerClient) {
            ServerClient project = (ServerClient) paper;
            Programmer frontEnd = new FrontEnd(),
                    backEnd = new BackEnd();
            project.setFrontEndProgrammer(frontEnd);
            project.setBackEndProgrammer(backEnd);
            Program client = frontEnd.makeProgram(project);
            Program server = backEnd.makeProgram(project);
            deploy(name, client, server);
        } else if (paper instanceof Client) {
            Client project = (Client) paper;
            Programmer frontEnd = new FrontEnd();
            project.setProgrammer(frontEnd);
            deploy(name, frontEnd.makeProgram(project));
        }
    }

    public void deploy(String projectName, Program... programs) {
    }
}

```

`Director` 코드에서 `frontEnd` 에게 `ServerClient` 를 주고 있는데 
이러면 `frontEnd`는 `language` 와 `library` 를 가져오지 못해서 이상한 결과가 나오게 된다.
LSP 나 OCP 를 위반하면 프로그램이 불안정해진다. 설계사가 LSP 와 OCP 를 특별히 신경써야 한다.  
이 두 원칙을 지키려고 한다면 나머지 **SRP**, **ISP**, **DIP** 3가지 원칙은 자연스럽게 지켜진다.

## LSP 위반 시행착오

{% include image.html alt="frontend-programmer-code" path="/images/study/code-spitz/frontend-programmer-code.jpg" %}

그림에서 빨간 영역이 **LSP** 를 위반하는 부분이다.
자식형을 부모형으로 치환해도 충분해야 하지만 그러지 못하기 때문에 다운캐스팅을 하고 있다.
다운 캐스팅을 하는 이유는 **LSP** 를 어겼기 때문이지만, 다운 캐스팅을 한 결과는 **OCP** 위반이 된다.
**LSP** 위반이 이 **OCP** 위반을 유도하는 것이다.

추상형에 대한 구상 지식을 가지려 했기 때문에 다운캐스팅이 이루어졌다.
그래서 복잡한 내부를 모르는 채 추상화에게 떠밀도록 **Don`t Ask(Hollywood 원칙)** 를 이용해야 한다.

```java 

public class FrontEnd implements Programmer {
    private Language language;
    private Library library;

    @Override
    public Program makeProgram(Paper paper) {
        paper.setData(this);
        return makeFrontEndProgram();
    }

    void setLanguage(Language language) {
        this.language = language;
    }

    void setLibrary(Library library) {
        this.library = library;
    }

    private Program makeFrontEndProgram() {
        return new Program();
    }
}

```

코드는 위와 같이 바뀌었다. 
`Paper` 에게 `Programmer` 형으로 `data` 받아서 세팅하도록 요구한다.
`setData` 에 `Programmer` 로 결정하면 하위형을 다 들어올 수 있는데 이걸 공변이라고 말한다. 
공변형으로 동작하고 return 값은 부모형으로만 반환하는 반변형으로 작동하게 된다. 
기존에 원칙을 어겼던 부분을 `Paper`에 넣었기 때문에 **LSP**와 **OCP**를 지킬 수 있게 되었다.

```java


abstract class Programmer {
    public Program getProgram(Paper paper) {
        paper.setData(this);
        return makeProgram(paper)
    }

    Program makeProgram(Paper paper);
}


```


위 코드에서 `makeProgram` 의 구조를 보면,
`Paper` 를 이용해서 `setData` 를 하는 것은 `frontEnd` 와 `backEnd` 가 똑같을 것이다.
`Programmer interface` 를 `abstract` 클래스로 변경하고 **template method** 로 만들어서 **hook** 으로 바꿔준다. 
**dry 원칙**때문에 `interface` 를 만들었다가 `abstract class` 로 바꾸고 **template method** 를 사용하게 된다..

> dry 원칙 Don't Repeat Yourself  
> 똑같은 일을 두번하지 않는다. 
> 중복되는 함수나 코드는 하나의 공통의 콤포넌트에 넣고 사용한다. 
> 큰 시스템을 여러 조각으로 나누고 서로 참조한다.

```java

public interface Paper {
    void setData(Programmer programmer);
}

```

`FrontEnd` 와 `BackEnd Programmer` 는 `Paper` 의 `setData` 같이 사용하기 때문에  `Paper`는 어쩔 수 없이 추상형 `Programmer` 로 받는다.

```java 

public class Client implements Paper {
    Library library = new Library("vueJS");
    Language language = new Language("kotlinJS");
    Programmer programmer;

    public void setProgrammer(Programmer programmer) {
        this.programmer = programmer;
    }

    @Override
    public void setData(Programmer programmer) {
        if (programmer instanceof FrontEnd) {
            FrontEnd frontEnd = (FrontEnd) programmer;
            frontEnd.setLibrary(library);
            frontEnd.setLanguage(language);
        }
    }
}

```

하지만 `Paper` 에게 책임이 주어져도 별 수 없다. 
`Programmer` 입장에서 **LSP** 와 **OCP** 가 지켜진 것 같지만 
이번에는 `Programmer` 가 일으켰던 `Context error` 를 `Paper` 가 일으키게 된다.
이게 강타입 언어에서 많이 등장하는 문제다.
**LSP** 는 증가하는 기능에는 효과적으로 지킬 수 없어서 해결 방법을 모르면 무조건 **다운캐스팅**하게 된다.

```java 

public class ServerClient implements Paper {
    Server server = new Server("test");
    Language backEndLanguage = new Language("java");
    Language frontEndLanguage = new Language("kotlinJS");

    private Programmer backEndProgrammer;
    private Programmer frontEndProgrammer;

    public void setBackEndProgrammer(Programmer programmer) {
        this.backEndProgrammer = programmer;
    }

    public void setFrontEndProgrammer(Programmer programmer) {
        this.frontEndProgrammer = programmer;
    }

    @Override
    public void setData(Programmer programmer) {
        if (programmer instanceof FrontEnd) {
            FrontEnd frontEnd = (FrontEnd) programmer;
            frontEnd.setLanguage(frontEndLanguage);
        } else if (programmer instanceof BackEnd) {
            BackEnd backEnd = (BackEnd) programmer;
            backEnd.setLanguage(backEndLanguage);
            backEnd.setServer(server);
        }
    }
}

```

`ServerClient` 는 심각하다.
`ServerClient` 는 `Programmer` 종류가 두 개이상으로 들어오는데 그때마다 다르게 반응해야 한다.
이전에 `BackEnd` 입장에서 `Paper` 와 1:1 관계로 한 종류만 처리하면 됐다. 
하지만 여기서 **의존성을 역전(관계 역전)** 시켰더니 1:n 관계로 되어 n개에 대한 case 를 처리하는 코드가 된다.
모든 종류의 프로그래머에게 성립하도록 해야 하므로 책임이 더 많아 졌다.

{% include image.html alt="paper-code" path="/images/study/code-spitz/paper-code.jpg" %}

`Client`은 `programmer` 를 받아서 **다운캐스팅**으로 `setData` 를 처리했다.
`BackEnd` 개발자의 경우는 처리하지 않게 됐고 그에 다라 모든 경우의 수를 파악하여 처리하기 힘들어졌다.
우리는 Client 의 setData 작성할 때, 호출 하는 쪽에서 부터 경우의 수를 산정하지 않고 특정 경우에만 동작하도록 코드를 작성한다.
그래서 위험한 코드가 나오게 되고 **OCP** 나 **LSP** 를 어기게 된다.

class 형 언어는 이런 상황을 유도하게 된다.

이런 상황을 피할 수 있는 방법은 객체의 테스트 코드를 작성하여 어떻게 사용되는지 파악하고 메소드를 작성하는 것이다.
TDD 의 진실된 의미는 객체를 어떤 측면에서 어떻게 사용되는지 시각적으로 확보하도록 도움을 주는 것이다. 
결국, 설계에 영향을 미치는게 아니라 method 의 영향을 미치게 된다.

{% include image.html alt="paper-code-with-generic" path="/images/study/code-spitz/paper-code-with-generic.jpg" %}

이 문제를 해소할 수 있는 것은 `Generic` 이다.
`if` 문과의 차이점은 형으로 결정한다는 것이다. 
`Generic`은 추상형을 유지하면서 구상형을 사용자가 결정하게 한다.
`Generic` 을 사용하면 `if instanceof` 를 제거할 수 있다.
그렇게 하면 `Context Error`를 `Compile Error` 으로 변경해서 일으킬 수 있다.

**다운 캐스팅**은 T가 되고 객체의 추상형은 extends 가 된다.
**다운 캐스팅**을 하면 **OCP** 를 어기게 되지만 여기서는 **업캐스팅**으로 바뀐 것이다.
T 형을 규정할때 upper bound 를 이용했지만 `instanceof` 는 바닥에 있는 bounce bound 이용해서 정의한다.

```java 

public class Client implements Paper<FrontEnd> {
    Library library = new Library("vueJS");
    Language language = new Language("kotlinJS");
    Programmer programmer;

    public void setProgrammer(Programmer programmer) {
        this.programmer = programmer;
    }

    @Override
    public void setData(FrontEnd programmer) {
        programmer.setLibrary(library);
        programmer.setLanguage(language);
    }
}

```

`Paper`에 T형을 받았다면 `Client`를 만들때, `Programmer` 의 구상 클래스인 `FrontEnd` 형을 넘길 수 있다.
그래서 `instanceof` 없이 구상형의 내용을 사용할 수 있게 됐다.

이전 `Client` 는 범용이었지만 여기서는 강력하게 `FrontEnd` 와 binding 되었고,
용도가 감소되어 제약 범위 안에서 코드를 작성할 수 있게 되었다.

{% include image.html alt="serverclient-code-with-generic" path="/images/study/code-spitz/serverclient-code-with-generic.jpg" %}

`Paper` 는 여러 `Programmer` 가 들어오는 큰 책임을 가져서 문제가 생긴다.
이전 `Client` 는 매핑 되는게 `FrontEnd` 한 가지이기 때문에 정확하게 T를 이용할 수 있었다.

그런데 `ServerClient` 는 여러 종류의 `Programmer` 를 담당했기 때문에 위와 같이 된다.
조건이 추가 된다고 계속 형을 추가할 수는 없다.


## OCP 와 제러닉을 통한 해결

`LSP` 를 해결하기 위해 `Generic` 을 이용하였으나 좋지 않았으므로 
`Generic` 과 **OCP** 를 결합하여 **Hollywood 원칙**으로 해결한다.

```java 

public interface Paper {
}


public class Client implements Paper {
    Library library = new Library("vueJS");
    Language language = new Language("kotlinJS");
    Programmer programmer;

    public void setProgrammer(Programmer programmer) {
        this.programmer = programmer;
    }
}

```

`Paper` 를 다시 원래대로 돌린다.
현실 세계의 객체 binding 은 1:1로 이루어지지 않고 1:n, n:n 이루어지는데 여기서도 `Paper` 와 `Programmer` 는 1:n 관계를 가진다.
여러개가 들어오는 n 쪽에서 구현을 하면 일반화할 수 없으니 1 을 가지는 쪽에서 구현을 해야 한다.

element 가 collector 를 아는 편보다 collector 가 element 를 아는 것은 여러 원소를 알아야 하므로 불리하다.
parent 입장에서는 많은 child 를 알아야되서 의존성의 무게가 달라지기 때문이다.

여기서 `Paper` 가 `Programmer` 다수를 소유하게 되므로 `Paper` 보다 `Programmer` 가 `Paper` 를 알게하는 것이 낫다.

그래서 `Paper` 는 다시 **maker interface** 로 돌아온다.
실제로도 `Paper` 는 비슷한 내용의 프로젝트가 존재하지 않기 때문에 추상화를 할 수가 없다.

```java 

public class ServerClient implements Paper {
    Server server = new Server("test");
    Language backEndLanguage = new Language("java");
    Language frontEndLanguage = new Language("kotlinJS");

    private Programmer backEndProgrammer;
    private Programmer frontEndProgrammer;

    public void setBackEndProgrammer(Programmer programmer) {
        this.backEndProgrammer = programmer;
    }

    public void setFrontEndProgrammer(Programmer programmer) {
        this.frontEndProgrammer = programmer;
    }
}

```

`ServerClient` 도 원래대로 다시 돌아온다.

```java  

abstract class Programmer<T extends Paper> {
    public Program getProgram(T paper) {
        setData(paper);
        return makeProgram();
    }

    abstract void setData(T paper);

    abstract Program makeProgram();
}

```

`Programmer` 쪽으로 `Paper` 가 알도록 수정했으니 `Paper`가 아닌 이 객체가 `SetData` 책임을 가진다.

`Programmer` 는 추상 클래스니까 `Paper` 를 T로 알 수 있고 T 에 대한 처리는 자식에게 맡긴다.

여기서 부모가 `setData`를 하고 `makeProgram`을 시키고 있는데,
**don't ask tell(Hollywood)** 은 템플릿 메소드를 구성하고 있는 부모 자식간 관계에도 똑같이 지켜진다.
자식클래스가 바뀔때마다 부모클래스가 바뀌는 이유는 상속 때문이 아니라 객체지향 원리를 어겼기 때문이다.

```java 

public abstract class BackEnd<T extends Paper> extends Programmer<T> {
    protected Server server;
    protected Language language;

    @Override
    public Program makeProgram() {
        return new Program();
    }
}

```

수 많은 종류의 `BackEnd` 개발자가 존재한다.
`server`, `language` 는 정해진 후 개발한다는 것만이 공통점이고, `Paper` 관점에 따라 `BackEnd` 를 다르게 본다. 

`backend` 의 공통 내용은 위 코드 `makeProgram`을 구현하고,
`setData` 는 `Paper` 의 종류에 따라서 각 구현 클래스에서 `if` 처럼 구현되어야 하므로 추상클래스가 된다.

`Programmer` 가 `if` 조건을 가지지 않기 위해서 **client** 로 넘긴다.
`Programmer` 가 `Paper` 한테 책임을 넘긴 건 협력 관계에 있는 도메인 레이어에게 떠넘기는 것이다.
같은 책임 레벨을 가지고 있는 레이어는 이 문제를 해결하지 못한다.

**LSP** 와 **OCP** 를 회복하는 유일한 방법은 반드시 자신보다 더 **client**쪽으로 밀어내야 한다.


```java 

public abstract class FrontEnd<T extends Paper> extends Programmer<T> {
    protected Language language;
    protected Library library;

    @Override
    public Program makeProgram() {
        return new Program();
    }
}

```

FrontEnd 도 마찬가지로 수정해준다.

## 클라이언트의 변화

구체적인 상황을 나누는 것을 **client** 이 가져갈수록 **service** 층이 안정화 된다.
서비스 층이 안정화됐으니 **client** 에서의 할 일이 많아졌지만 역할 책임 모델로 책임을 분산했기 때문에 **client** 가 뭉쳐진 책임을 갖게 되지 않는다.
코드에 if 를 가져오지 않고 형으로 해결하게 된다.

{% include image.html alt="director-code" path="/images/study/code-spitz/director-code.jpg" %}

기존에 `Paper` 를 처리하는 코드를 보면  `program` 을 만든 것을 가지고 `deploy` 하는 책임이 있다는 것을 확인하면
중복적인 코드가 있다는 것을 알 수 있다.

`Generic` 으로 `Programmer` 가 특정 `Paper` 만 받아들이도록 제약을 걸었으니 내부의 코드가 바뀐다.

 ```java 

public class Director {
    private Map<String, Paper> projects = new HashMap<>();

    public void addProject(String name, Paper paper) {
        projects.put(name, paper);
    }

    public void runProject(String name) {
        if (!projects.containsKey(name)) throw new RuntimeException("no project");
        Paper paper = projects.get(name);
        if (paper instanceof ServerClient) {
            ServerClient project = (ServerClient) paper;
            Programmer frontEnd = new FrontEnd<ServerClient>() {
                @Override
                void setData(ServerClient paper) {
                    language = paper.frontEndLanguage;
                }
            };
            Programmer backEnd = new BackEnd<ServerClient>() {
                @Override
                void setData(ServerClient paper) {
                    server = paper.server;
                    language = paper.backEndLanguage;
                }
            };

            project.setFrontEndProgrammer(frontEnd);
            project.setBackEndProgrammer(backEnd);
            Program client = frontEnd.makeProgram(project);
            Program server = backEnd.makeProgram(project);
            deploy(name, client, server);
        } else if (paper instanceof Client) {
            Client project = (Client) paper;
            Programmer frontEnd = new FrontEnd<Client>() {
                @Override
                void setData(Client paper) {
                    language = paper.language;
                    library = paper.library;
                }
            };
            project.setProgrammer(frontEnd);
            deploy(name, frontEnd.makeProgram(project));
        }
    }

    public void deploy(String projectName, Program... programs) {
    }
} 

```
 
 
범용적인 `FrontEnd` 를 만들지 말고 `ServerClient` 만 아는 `FrontEnd` 를 만들어야 한다. 
마찬가지로 `BackEnd` 도 `ServerClient` 만 알도록 수정해야 한다.

`if` 문에 해당되는 경우의 수만큼의 객체를 만들고, 어떤 객체를 만들어야 할지는 `Director` 가 선택해야 한다.

각 `Programmer`들이 어떤 `Paper`에 대해서 반응할지를 추상화의 레벨에서 말단인 **client** 쪽에 객체에게 밀어낸 것이다.
가장 말단 객체에게 밀어내야 모든 경우의 수가 객체를 새로 만드는 것으로 해결된다.
이제 `Director` 를 제외한 전구간에서 **LSP** 와 **OCP** 를 어기는 부분이 없어졌다. 

`Director` 에서도 `instanceof` 가 있는데 n개의 `projects` 를 소유하고 있기 때문에 `Director` 를 `Generic` 으로 해결할 수 없다.
그러면 의존성 역전을 시켜야 한다.
Director 가 n개의 Paper 를 갖고 있기 때문에 Director 가 Paper 를 추상화하는 것은 불가능하므로,
`Paper` 가 `Director` 에게 서비스를 제공하고 추상화하면 된다. 


{% include image.html alt="director-code-ocp-fail" path="/images/study/code-spitz/director-code-ocp-fail.jpg" %}


`Director` 에서 조차도 `if instanceof` 분기를 사용해서 **OCP** 위반을 하고 있다.
그래서 **client**로 경우의 수만큼 생성하는 방법으로 해결해야 한다.
빨간 두 영역에서 공통 부분을 추상화 해야한다. 
`deploy` 는 `programs` 만 받으면 되는 인터페이스니까 빨간 두 영역이 `programs` 만 `return` 하면 된다.

그러면 우리는 `Programs` 를  `return` 하는 일반적인 인터페이스로 `Paper` 를 선언할 수 있다.


```java 

public interface Paper {
    Program[] run();
}

```

`Paper` 는 결국 인자 없이 `run` 을 하면 `Program` 을 배열을 준다.
이 책임이 원래 `Director` 가 `Project` 를 수행해야 하지만  `Paper` 가  프로젝트 수행으로 넘어가버렸다.
책임 역할 모델에서는 도메인과 일치하지 않게 가장 적당한 객체가 그 역할을 가져간다.


```java  
public abstract class ServerClient implements Paper {
    Server server = new Server("test");
    Language backEndLanguage = new Language("java");
    Language frontEndLanguage = new Language("kotlinJS");

    private Programmer backEndProgrammer;
    private Programmer frontEndProgrammer;

    public void setBackEndProgrammer(Programmer programmer) {
        this.backEndProgrammer = programmer;
    }

    public void setFrontEndProgrammer(Programmer programmer) {
        this.frontEndProgrammer = programmer;
    }
}

public abstract class Client implements Paper {
    Library library = new Library("vueJS");
    Language language = new Language("kotlinJS");
    Programmer programmer;

    public void setProgrammer(Programmer programmer) {
        this.programmer = programmer;
    }
}

```

그럼 `ServerClient` , `Client` 는 `Paper` 구상클래스가 아니라  `Paper` 로 부터 `run` 을 다르게 가져갈 수 있는 추상형으로 바뀐다.
`ServerClient` , `Client` 의 클래스는 단순히 `abstract` 로 변경한다.  

```java 

public class Director {
    private Map<String, Paper> projects = new HashMap<>();

    public void addProject(String name, Paper paper) {
        projects.put(name, paper);
    }

    public void runProject(String name) {
        if (!projects.containsKey(name)) throw new RuntimeException("no project");
        deploy(name, projects.get(name).run());
    }

    public void deploy(String projectName, Program... programs) {
    }
}

```

그러면 `Director` 는 모든 **LSP**와 **OCP**을 **client** 방향인 `main` 까지 밀어냈다.
객체 지향 설계에 성공했다면 모든 `if case` 는 `main` 까지 밀어야 하는 것이다.


```java 

public class Main {
    public static void main(String[] args) {
        Director director = new Director();
        director.addProject("여행사A 프론트 개편", new Client() {
            @Override
            public Program[] run() {
                FrontEnd frontEnd = new FrontEnd<Client>() {
                    @Override
                    void setData(Client paper) {
                        library = paper.library;
                        language = paper.language;
                    }
                };
                setProgrammer(frontEnd);
                return new Program[]{
                        frontEnd.getProgram(this)
                };
            }
        });

        director.runProject("여행사A 프론트 개편");
    }
}


```

`main` 에서 `Client` 프로젝트를 만들고 있지만  수용 방법이 `run` 방법인  형이 완전 다른 `Client Paper` 가 된다.
전부 새로운 형으로 생성하는 것으로 변경됐다.
`case` 에 맞는 형을 새로 만들면서 `if` 를 제거한다.

수행방법을 보면 `frontEnd` 한명을 섭외해서 프로그램 받아내서 `deploy` 하는 수행방법을 가지고 있고 
`frontEnd` 는 섭외할 때 `setData` 대로 세팅하는 `frontEnd` 로 섭외해야 한다는 의미이다.
`main` 까지 밀어내는데 성공하면 `Client` 나 `FrontEnd` 를 DI 해서 사용하면 된다. 
추상 레이어에서 **DI** 하면 프로그램이 망가지기 때문에 말단인 `main`쪽에서 **DI** 를 해야 한다.


원래 `setProgrammer` 라는 `interface` 는 `Client` 가 외부에서 자신의 속성을 변경할 수 있는 메세지를 허용해주기 위해 만든 것인데.
`Client`가 형으로 확장했기 때문에 외부용 메세지가 필요 없게 되어 class 의 은닉성, 보안성이 높아진다.
사실 원래 `setProgrammer`는 전형적인 `setter` 로 은닉성이 깨지고 있었다. 
그런데 객체 지향을 제대로 했다면 `Client` 속성에 대해서 외부에서 변경할 필요가 없다.
본인의 속성이기 때문에 그냥 변경하면 되서 아래 코드로 변경된다.

```java 
public class Main {
    public static void main(String[] args) {
        Director director = new Director();
        director.addProject("여행사A 프론트 개편", new Client() {
            @Override
            public Program[] run() {
                FrontEnd frontEnd = new FrontEnd<Client>() {
                    @Override
                    void setData(Client paper) {
                        library = paper.library;
                        language = paper.language;
                    }
                };
                // 변경
                programmer = frontEnd;
                return new Program[]{
                        frontEnd.getProgram(this)
                };
            }
        });

        director.runProject("여행사A 프론트 개편");
    }
}
```

이전에 `Director`이 `setProgrammer` 을 이용해서 세팅하는 것보다 `programmer` 필드 속성의 은닉성이 높아졌다.


```java 

public abstract class Client implements Paper {
    Library library = new Library("vueJS");
    Language language = new Language("kotlinJS");
    Programmer programmer;

//    public void setProgrammer(Programmer programmer) {
//        this.programmer = programmer;
//    }
}

```

결국, `Client` 의 `setProgrammer` 인터페이스를 없앴고 `programmer` 가 `protected` 수준으로 보안이 향상 되었다.



```java 

public abstract class ServerClient implements Paper {
    Server server = new Server("test");
    Language backEndLanguage = new Language("java");
    Language frontEndLanguage = new Language("kotlinJS");

    protected Programmer backEndProgrammer;
    protected Programmer frontEndProgrammer;

//    public void setBackEndProgrammer(Programmer programmer) {
//        this.backEndProgrammer = programmer;
//    }
//
//    public void setFrontEndProgrammer(Programmer programmer) {
//        this.frontEndProgrammer = programmer;
//    }
}


```

마찬가지로 `ServerClient` 에서도 보안성이 높아졌기 때문에 은닉성을 깨는 메소드를 제거한다.


```java 

director.addProject("xx은행 리뉴얼", new ServerClient() {
    @Override
    public Program[] run() {
        Programmer frontEnd = new FrontEnd<ServerClient>() {
            @Override
            void setData(ServerClient paper) {
                language = paper.frontEndLanguage;
            }
        };

        Programmer backEnd = new BackEnd<ServerClient>() {
            @Override
            void setData(ServerClient paper) {
                server = paper.server;
                language = paper.backEndLanguage;
            }
        };

        frontEndProgrammer = frontEnd;
        backEndProgrammer = backEnd;
        return new Program[]{frontEnd.getProgram(this), backEnd.getProgram(this)};
    }
});

```

`Director` 가 추상형이 아니고 구상형이기 때문에 1:n 의 관계가 성립되지 않고 1:1 관계로 되기 때문에
`instanceof` 를 사용할 일이 없어서 `Generic` 이 필요 없게 되었다.

만약, `Director` 가 `Paper` 에 따라 분기되는 추상형이었으면 `Paper` 의 `<T extends Director>` 형태로 `Generic`의 관여가 필요하다.
그러면 `Paper` 가 `Director T` 를 받고 `Director T` 에 따른 `run` 의 로직을 변경해야 하고 다시 경우의 수를 나눠줘야 한다.
그렇게 되면 위의 코드는 해당 `Director T` 에 있는 메소드로 옮겨가게 된다.


`Generic` 을 사용하여  `instanceof if` 를 제거할 수 있고 
객체 지향 방법과 추상형을 이용해서 나머지 `if` 를 제거할 수 있었다.
결국, 두 가지 방법을 결합 하면 모든 케이스의 `if` 를 제거할 수 있다.


