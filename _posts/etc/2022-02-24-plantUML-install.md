---
title: '[IntelliJ] MacOS 에서 PlantUML 사용하기'
tags: [IntelliJ, plantUML, Graphviz]
---

PlantUML 은 텍스트만으로도 UML 다이어그램을 만들 수 있게 도와주는 오픈소스다.  
IntelliJ 등 JetBrain IDE 에서는 PlantUML 플러그인을 지원해주고 있는데 그 사용법에 대해서 알아본다.
    
<!--more-->

## Graphviz 설치 

Graphviz 는 그래프 시각화해주는 오픈 소스 소프트웨어로, 
PlantUML 을 사용하기 위해서는 사전에 Graphviz 설치가 필요하다.    
만약, Graphviz 설치 없이 PlantUML 을 사용하려고 한다면 
다음과 같은 에러가 발생될 것이다.

{% include image.html alt="not found graphviz" path="images/etc/plantUML-graphviz/graphviz-error.png" %}

```text
Dot: Executable: /opt/local/bin/dot
File does not exist
Cannot find Graphviz. You should try... 
```

MacOS 환경에서 Graphviz 설치하기 위해 패키지 관리자 [homebrew](https://brew.sh/index_ko) 를 이용한다.

```shell
brew install libtool
brew link libtool
brew install graphviz
brew link --overwrite graphviz
```

다른 운영체제 환경에서 Graphviz 설치가 필요하다면, 
[PlantUML 공식 홈페이지](https://plantuml.com/ko/graphviz-dot) 를 참고하도록 하자. 


## PlantUML Plugin 설치

이제 IntelliJ 에서 plantUML 을 사용하기 위해 플러그인을 설치하도록 하자.  
`Command` + `,` 또는 IntelliJ Idea → Preferences 을 클릭하여 IDE 설정으로 이동한다. 

{% include image.html alt="not found graphviz" path="images/etc/plantUML-graphviz/plantUML-plugin.png" %}

왼쪽 메뉴에서 Plugins 을 클릭해서 PlantUML 을 검색하면 위와 같이 보인다. 
가장 상단에 있는 'PlantUML integration' 을 설치해주면 된다. 
플러그인 설치가 끝나면, 반드시 IDE 를 재실행해주도록 하자

{% include image.html alt="plantUML example" path="images/etc/plantUML-graphviz/plantUML-example.png" %}

이처럼 예시 이미지가 보이면 정상적으로 plantUML 설치가 된 것이다.  
하지만, 위와 같이 설정을 했어도 graphviz 을 못찾는 경우가 있는데, 
이런 경우 직접 경로를 지정해주어야 한다.  
아래 명령어를 통해서 dot 의 경로를 검색해주도록 한다.

```shell
$ which dot 
/opt/homebrew/bin/dot
```

컴퓨터 환경에 따라 경로가 다를 수 있으므로 주의하자.  
다시, IDE 의 Preference 로 이동해서 이번에는 PlantUML 설정을 해주도록 하자.

{% include image.html alt="plantUML preference" path="images/etc/plantUML-graphviz/plantUML-preference.png" %}

PlantUML 설정을 보면 중간에 Graphviz dot executable 항목이 있다.  
이곳에 본인 컴퓨터 환경에서의 dot 경로를 지정해주면 정상적으로 plantUML이 작동한다.

