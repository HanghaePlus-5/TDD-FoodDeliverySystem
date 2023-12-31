![image](https://github.com/HanghaePlus-5/TDD-FoodDeliverySystem/assets/92039854/447982e7-5009-4a9d-a232-755bed088c2a)

## Description
#### TDD 로 개발한 NestJs 기반의 음식 배달 서비스 백앤드 서버.
#### 

## Features
#### 🚨 아직 진행중인 프로젝트로, 기능은 실시간으로 추가 될 예정입니다.
#### 🔔 유저 SignUp 과 Login 기능
#### 🔔 사장님 유저의 매장등록 및 메뉴 등록 기능
#### 🔔 일반 유저의 음식 주문기능 및 실시간 알림 기능 
#### 🔔 결제 기능

## Getting Started
#### Installation

```bash
$ pnpm install
$ npx prisma generate
```

#### Running the app

```bash
$ pnpm start
```

## Swagger
### 🚨 TDD 로 unit 테스트 단위 부터 작성 하며 구축하고 있기 때문에 아직 API 엔드포인트가 정리되지 않았습니다.
<img width="882" alt="KakaoTalk_Image_2023-06-30-22-43-54" src="https://github.com/HanghaePlus-5/TDD-FoodDeliverySystem/assets/92039854/59baac57-19b3-4ad3-9948-553d525c1739">
<img width="878" alt="KakaoTalk_Image_2023-06-30-22-43-59" src="https://github.com/HanghaePlus-5/TDD-FoodDeliverySystem/assets/92039854/717a0445-6400-46c1-986b-70032259ee09">

## Git Branching Strategies
### Git Flow 의 간소화 된 버전 사용 ( `Feature/<도메인>` -> `Dev` -> `Prod` )
#### 소규모 팀으로 소규모 서비스를 구현하였기 때문에 간소화 된 버전의 Git Flow 를 사용하였습니다.
#### 다만 서로의 코드를 효과 적으로 리뷰 하고 소통 할 수 있도록 PR 시 전원의 Review/Approval 후 Merge 할 수 있도록 하였습니다.

### Git Flow 전략이란?
#### 5가지 브랜치:
- master: 최상위 브랜치, 서비스의 배포 
- develop: 기능단위의 작업물들을 통합
- feature: 기능 단위의 개발
- release: 배포전 QA 등을 수행 
- horfix: 버그의 긴급 수정

![image](https://github.com/HanghaePlus-5/TDD-FoodDeliverySystem/assets/92039854/65297edf-cad8-4ef6-8385-188fa4630882)


## Convention Templates (PR, Issue)
### PR Template:
```bash
Title: 커밋 내역을 최대한 한 문장으로 정리
```
```bash
## 주요내용(Optional):
- 커밋 세부 작업 내용의 요약 1
- 커밋 세부 작업 내용의 요약 2
- 커밋 세부 작업 내용의 요약 3

## 기타(Optional):
- 다른 팀원들의 작업내용과 충돌 할 수 있는 사항 1
- 그 외 다른 팀원들과 함께 공유 및 고려 하고싶은 사항 1
```

### Issue Template:
#### 🚨 현재는 사용하고 있지 않으나 추후 도입 예정
