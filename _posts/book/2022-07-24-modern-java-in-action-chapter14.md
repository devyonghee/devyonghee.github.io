---
title: '[Modern Java in Action] Chapter14. 자바 모듈 시스템'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 14장에서는 자바 모듈 시스템에 대해 소개하고 있다.   
자바 모듈 시스템이 무엇이며, 어디에 사용되는지, 이를 통해 어떤 이점이 있는지 알아본다. 


<!--more-->

자바 9에서 가장 많이 거론되는 새로운 기능은 모듈 시스템이다.  
모듈 시스템은 완성까지 십년이 걸렸으며 그만큼 중요하고 구현하기 어려운 기능이다. 


<br/>

## 14.1 압력: 소프트웨어 유추 

소프트 웨어 아키텍처에서는 기반 코드를 변경할 때 유추하기 쉬우므로 생산성을 높일 수 있는 소프트웨어 프로젝트가 필요하다.  
이렇게 추론하기 쉬운 소프트웨어를 만들기 위해서는 관심사분리와 정보 은닉이 도움이 된다.


### 관심사분리(SoC, separation of concerns)

관심사분리는 프로그램을 고유의 기능으로 나누는 동작을 권장하는 원칙이다.  
서로 겹치지 않는 코드 그룹으로 분리할 수 있고 그룹화한 모듈을 이용해 클래스 간의 관계를 시각적으로 확인할 수 있다.

SoC 원칙은 다음과 같은 장점들이 있다. 
- 아키텍처 관점, 복구 기법을 비즈니스 로직과 분리하는 등 하위 수준 접근 등의 상황에 유용 
- 개별 기능을 따로 작업할 수 있으므로 팀이 쉽게 협업
- 개별 부분 재사용 가능
- 전체 시스템을 쉽게 유지보수


### 정보은닉(information hiding)

정보 은닉은 세부 구현을 숨기도록 장려하는 원칙이다.  
세부 구현을 숨겨서 다른 부분의 영향을 줄여서 코드를 관리하고 보호하는 유용한 원칙이다.  
하지만 자바 9 이전까지는 클래스와 패키지가 의도된 대로 공개되었는지 컴파일러로 확인할 수 있는 기능이 없었다.  

### 자바 소프트웨어

잘 설계된 소프트웨어를 위해서는 위 두 가지 원칙을 따르는 것이 중요하다.  
하지만 자바에서 제공하는 `public`, `protected`, `private` 등의 접근 제한자와 패키지 수준 접근 권한 등으로는 원하는 정보 은닉을 달성하기 어렵다. 
심지어 원하지 않는 메서드를 공개해야하는 상황도 발생된다.   
이러한 문제는 애플리케이션이 커지면서 부각되고 있다.  


<br/>

## 14.2 자바 모듈 시스템을 설계한 이유

자바 언어와 컴파일러에 새로운 모듈 시스템이 추가된 이유를 알아본다. 

### 모듈화의 한계

자바는 클래스, 패키지, JAR 세 가지 수준의 코드 그룹화를 제공한다.  
하지만 자바 9 이전까지는 클래스와 관련하여 접근 제한자와 캡슐화를 지원했지만 패키지와 JAR 수준에서는 거의 지원하지 않았다.

#### 제한된 가시성 제어

- 네 가지 접근자(public, protected, 패키지 수준, private)가 존재하지만 패키지의 가시성 제어 기능은 무의미   
  - 내부적으로 사용할 목적이어도 다른 곳에서 사용할 수 있어서 라이브러리 코드 변경이 어려움 

#### 클래스 경로와 JAR 조합의 약점

- 클래스 경로에는 같은 클래스를 구분하는 버전 개념이 없음
  - 같은 라이브러리의 다른 버전을 사용하면 어떤 일이 일어날지 예측할 수 없음
- 클래스 경로는 명시적인 의존성을 지원하지 않음
  - 자바, JVM 명시적인 의존성을 정의하지 않아서 정상적으로 실행할 때까지 클래스를 추가하거나 제거해봐야 함
  - 메이븐이나 그레이들 같은 빌드도두가 해결하는데 도움을 줌

### 거대한 JDK

자바 개발 키트(JDK)는 자바 프로그램을 만들고 실행하는데 도움을 주는 도구의 집합이다.  
하지만 JDK 의 내부 API 는 공개되지 않아야 하는데 낮은 캡슐화 지원으로 외부에 공개되었다. (ex. `sun.misc.Unsafe`)   
이러한 문제로 호환성을 깨지 않고는 관련 API를 바꾸기 어려운 상황이 되었다. 

### OSGi 와 비교

자바 9에서 모듈화 기능이 추가되기 전에도 자바에는 OSGi(Open Service Gateway initiative) 는 모듈 시스템이 존재했다.  
자바 9 모듈 시스템과 OSGi 는 상호 배타적인 관계는 아니므로 공존이 가능하다.  

번들이라 불리는 OSGi 모듈은 특정 OSGi 프레임워크 내에서만 실행된다. (ex. 아파치 펠릭스, 에퀴녹스)  
OSGi 프레임워크 내에서 애플리케이션을 실행할 때 원격으로 개별 번들을 설치, 시작, 중지, 갱신, 제거가 가능하다.  
시스템을 재시작하지 않아도 하위 부분을 핫스왑할 수 있다는 점이 강점이며, 같은 번들의 다른 버전 설치도 가능하다.

| 번들 상태       | 설명                                                                     |
|-------------|------------------------------------------------------------------------|
| INSTALLED   | 번들이 성공적으로 설치됨                                                          |
| RESOLVED    | 번들에 필요한 모든 자바 클래스를 찾음                                                  |
| STARTING    | 번들이 시작되면서 BundleActivator.start 라는<br/> 메서드가 호출되었지만 start 메서드가 반환되지 않음 |
| ACTIVE      | 번들이 성공적으로 활성화되고 실행됨                                                    |
| STOPPING    | 번들이 정지되는 중. BundleActivator.stop 메서드가 호출되었지만 <br/> 아직 stop 메서드가 반환되진 않음 |
| UNINSTALLED | 번들의 설치가 제거됨. 다른 상태로 이동할 수 없음                                           |


<br/>

## 14.3 자바 모듈 : 큰 그림

자바 8은 모듈이라는 프로그램 구조 단위를 제공하는데 모듈은 `module` 키워드에 이름과 바디를 추가해서 정의한다.  
모듈 디스크립터(module descriptor)는 module-info.java 라는 파일을 보통 패키지와 같은 위치에 저장한다.
여러 패키지를 서술하고 캡슐화할 수 있긴 하지만 일반적으로 한 개 패키지만 노출시킨다.

{% include image.html alt="module-info.java structure" source_txt='모던 자바 인 액션' path="images/book/modern-java-in-action/module-info-structure.png" %}

`exports` 에는 노출하고자 하는 패키지, `requires` 에는 필요로 하는 모듈을 정의한다.  
하지만 메이븐 같은 도구를 사용하면 IDE가 처리해주기 때문에 사용자에게는 잘 드러나지 않는다.  


<br/>

## 14.4 자바 모듈 시스템으로 애플리케이션 개발하기 

작음 모듈화ㅏ 애플리케이션을 구조화, 패키지, 실행하는 방법에 대해 알아본다.

### 애플리케이션 셋업 

모듈 시스템을 이해하기 위해 비용을 관리해주는 예제 애플리케이션을 구현해본다.  

- 프로젝트에서 처리해야 할 작업
  - 파일이나 URL 에서 비용 목록 읽기
  - 비용의 문자열 표현을 파싱
  - 통계 계산
  - 요약 정보 표시
  - 각 태스크의 시작, 마무리 지점 제공
- 프로젝트에 필요한 기능
  - 다양한 소스에서 데이터를 읽음 (Reader, HttpReader, FileReader)
  - 다양한 포맷으로 구성된 데이터를 파싱 (Parser, JSONParser, ExpenseJSON-Parser)
  - 도메인 객체 구체화 (Expense)
  - 통계를 계산하고 반환 (SummaryCalculator, SummaryStatistics)
  - 다양한 기능 분리 조정 (ExpensesApplication)
- 그룹화
  - expenses.readers
  - expenses.readers.http
  - expenses.readers.file
  - expenses.parsers
  - expenses.parsers.json
  - expenses.model
  - expenses.statistics
  - expenses.application

### 세부적인 모듈화와 거친 모듈화

시스템을 실용적으로 분해하면서 프로젝트가 이해하고 쉬운 수준으로 모듈화되어 있어야 한다.

- 세부적인 모듈화 기법
  - 모든 패키지가 자신의 모듈을 가짐
  - 이득에 비해 설계 비용 증가
- 거친 모듈화 기법
  - 한 모듈이 시스템의 모든 패키지를 포함
  - 모듈화의 모든 장점을 잃음

### 자바 모듈 시스템의 기초

메인 애플리케이션을 지원하는 한 개의 모듈만 갖는 애플리케이션 알아본다.  

```text
프로젝트 디렉터리 구조

|-- expenses.application
  |-- module-info.java
  |-- com
    |-- example
      |-- expenses
        |-- application
          |-- ExpensesApplication.java
```

```java 
// module-info.java
module expenses.application {
}
```

보통 IDE와 빌드 시스템에서 명령을 자동으로 처리해주긴 하지만 모듈 소스 디렉터리에서는 다음 명령을 실행하게 된다.  
컴파일 과정에 module-info.java 가 새롭게 추가되었다. 

```shell
javac module-info.java
    com/example/expenses/application/ExpensesApplication.java -d target
        
jar cvfe expenses-application.jar
    com.example expenses.application.ExpensesApplication -C target
    
java --module-path expenses-application.jar
     --module expenses/com.example.expenses.application.ExpensesApplication
```

`.class` 파일을 실행할 때에도 다음 두가지 옵션도 추가되었다.
- `--module-path` : 어떤 모듈을 로드할 수 있는지 지정 (클래스 파일을 지정하는 `--classpath` 인수와 다름) 
- `--module` : 이 옵션을 실행할 메인 모듈과 클래스를 지정

<br/>

## 14.5 여러 모듈 활용하기

이제 비용을 읽을 수 있는 기능을 캡슐화한 `expense.reader` 새 모듈을 생성하여,  
기본 모듈인 `expenses.application` 과 상호작용하는 예제를 살펴본다.  
상호작용에는 자바 9에서 지정한 `export`, `requires` 를 이용한다. 

### exports 구문

모듈 시스템은 화이트 리스트 기법으로 캡슐화를 제공하므로,  
다른 모듈에서 사용할 수 있는 기능을 명확하게 명시해야 한다. 

```java 
module expenses.readers {
    exports com.example.expenses.readers;      // 패키지명
    exports com.example.expenses.readers.file;
    exports com.example.expenses.readers.http;  
}
```

```text
프로젝트 디렉터리 구조

|-- expenses.application
  |-- module-info.java
  |-- com
    |-- example
      |-- expenses
        |-- application
          |-- ExpensesApplication.java
|-- expenses.readers
  |-- module-info.java
  |-- com
    |-- example
      |-- expenses
        |-- readers
          |-- Reader.java
        |-- file
          |-- FileReader.java
        |-- http
          |-- HttpReader.java                    
```

### requires 구문

requires 은 의존하고 있는 모듈을 지정한다.  
기본적으로 모든 모듈은 `java.base` 플랫폼 모듈을 의존하기 때문에 명시적으로 정의할 필요는 없다. (다른 모듈의 경우에는 필요)


```java 
module expenses.readers {
    requires java.base;  // 모듈명
    
    exports com.example.expenses.readers;      // 패키지명
    exports com.example.expenses.readers.file;
    exports com.example.expenses.readers.http;  
}
```

### 이름 정하기

모듈의 이름은 오라클에서 패키지명처럼 인터넷 도메인명을 역순으로 지정하도록 권고한다. (ex. `com.iteratrlearning.training`)  
더욱이 노출된 주요 API 패키지와 이름이 같아야 한다는 규칙도 따라야 한다.  


<br/>

## 14.6 컴파일과 패키징

메이븐 등의 빌드 도구를 이용해 프로젝트를 컴파일 하는 방법을 알아본다.  
각 모듈은 독립적으로 컴파일 되므로 부모 모듈과 함께 각 모듈에 pom.xml 을 추가한다.  
모듈 디스크립터(module-info.java)는 `src/main/java` 디렉터리에 위치해야 하며, 
올바른 모듈 소스 경로를 이용하도록 메이븐이 javac 설정을 한다. 

```text
|-- pom.xml
|-- expenses.application
  |-- pom.xml
  |-- src
    |-- main
      |-- java
        |-- module-info.java
        |-- com
          |-- example
            |-- expenses
              |-- application
                |-- ExpensesApplication.java
|-- expenses.readers
  |-- pom.xml
  |-- src
    |-- main
      |-- java
        |-- module-info.java
        |-- com
          |-- example
            |-- expenses
              |-- readers
                |-- Reader.java
              |-- file
                |-- FileReader.java
              |-- http
                |-- HttpReader.java                    
```

원활한 빌드를 위해 자식 모듈에서는 부모 모듈을 지정하고, 부모 모듈에서는 자식 모듈을 참조한다.

```xml 
<!-- expenses 전역 pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
  
    <groupId>com.example</groupId>
    <artifactId>expenses</artifactId>
    <version>1.0</version>
    <packaging>pom</packaging>
    <modules>
        <module>expenses.application</module>
        <module>expenses.readers</module>
    </modules>
    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.7.0</version>
                    <configuration>
                        <source>9</source>
                        <target>9</target>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
<!-- expenses 전역 pom.xml -->

<!-- expenses.readers pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
  
    <groupId>com.example</groupId>
    <artifactId>expenses.readers</artifactId>
    <version>1.0</version>
    <packaging>jar</packaging>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>expenses</artifactId>
        <version>1.0</version>
    </parent>
</project>
<!-- expenses.readers pom.xml -->

<!-- expenses.application pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
  
    <groupId>com.example</groupId>
    <artifactId>expenses.application</artifactId>
    <version>1.0</version>
    <packaging>jar</packaging>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>expenses</artifactId>
        <version>1.0</version>
    </parent>
    
    <dependencies>
        <!-- ExpenseApplication 에서 필요한 클래스와 인터페이스가 있으므로 의존성 추가 -->
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>expenses.readers</artifactId>
            <version>1.0</version>
        </dependency>
    </dependencies>
</project>
<!-- expenses.application pom.xml -->
```

`mvn clean package` 명령으로 모듈을 jar 로 생성할 수 있다.   
두 jar 을 모듈 경로에 포함해서 다음 명령어로 애플리케이션을 실행한다.

```shell
java --module-path \
./expenses.application/target/expenses.application-1.0.jar:\
./expenses.readers/target/expenses.readers-1.0.jar \
  --module expenses.application/com.example.expenses.application.ExpensesApplication
```