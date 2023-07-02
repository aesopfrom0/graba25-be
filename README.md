# 프로젝트 설명

https://github.com/aesopfrom0/graba25

GRABA25-API는 시간관리 웹 앱인 [pomofocus.io](http://pomofocus.io)를 클론한 GRABA25 프로젝트를 위한 API입니다.

평소 개인/직장에서 업무 수행 시 [pomofocus.io](http://pomofocus.io) 서비스를 사용하면서 불편한 점은 다음과 같습니다.

- 같은 task를 두 번 적어야함 (Notion, 시간관리 앱)
- 시간관리 앱에서의 기록은 notion에 연동되지 않음
- 기존 pomofocus.io에서는 제목과 메모만 기록 가능하기에 자세한 내용을 기록/조회하기 불편함 (* v0.1.0 현재 아직 개발 안 됨)

이를 해결하고자 본 프로젝트에서는 Notion을 DB처럼 이용하였습니다.

# 개발 환경

- Node.js (>= 18.0.0)
- npm (>= 8.0.0)

# 실행 방법

1. 레포지토리 클론
2. npm 패키지 설치

```
$ npm i
```

3. notion 가입 및 API 키 생성
    1. https://www.notion.so/my-integrations
        1. 참조:  https://developers.notion.com/docs/create-a-notion-integration
    2. (사용하려는 API 통합이 없다면) `+새 API 통합 만들기` 
    3. `프라이빗 API 통합 시크릿` **확인**
  
4. DB로 사용할 페이지 생성 후 API 연결 추가
    다음 notion 페이지를 개인 워크스페이스로 복제 https://aesopballer.notion.site/GRABA25-DB-1c5678fc8cb1401fa58eb35a0982af9e?pvs=4
<img width="1158" alt="스크린샷 2023-07-02 13 40 31" src="https://github.com/aesopfrom0/graba25-be/assets/72098049/5a4a1b5d-c465-4f73-9c1a-9b753a54cb32">

   페이지에 있는 `task 테이블 생성` 버튼 클릭
   
   전체 페이지로 열기 후 
   <img width="988" alt="스크린샷 2023-06-23 11 27 12" src="https://github.com/aesopfrom0/graba25-be/assets/72098049/2d4571f6-3398-4cb4-8132-4992c4efc25c">

   웹 주소에서 마지막 URL 경로인 task_table_id 기록
   <img width="1479" alt="스크린샷 2023-06-23 11 31 15" src="https://github.com/aesopfrom0/graba25-be/assets/72098049/b0193e44-85ee-4564-a30f-210888b7883b">

    
6. src/config/ 경로에 환경변수 파일 추가 .prod.env

```
PORT=

NOTION_API_KEY=
TASK_TABLE_ID=
```

6. 실행

```
npm run start:prod
```

# 테이블 상세

## task
<img width="256" alt="스크린샷 2023-06-23 11 48 39" src="https://github.com/aesopfrom0/graba25-be/assets/72098049/27ca3363-ff65-41d6-b935-2b159b88197c">
