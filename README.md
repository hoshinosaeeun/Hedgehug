| Endpoint              | Method | 설명         | 요청 파라미터                                                          | 응답 형식              |
| --------------------- | ------ | ---------- | ---------------------------------------------------------------- | ------------------ |
| `/auth/register`      | POST   | 회원가입       | userid, password, name, age, phone, address, detailAddress, role | 회원가입 성공 여부         |
| `/auth/login`         | POST   | 로그인        | userid, password                                                 | JWT 토큰 + 사용자 정보    |
| `/chat/:meetingId`    | GET    | 채팅 불러오기    | meetingId (URL 파라미터)                                             | 채팅 목록              |
| `/meeting/challenges` | GET    | 챌린지형 모임 목록 | -                                                                | 모임 목록              |
| `/meeting/offline`    | POST   | 오프라인 모임 생성 | category, description                                            | 생성된 모임 객체          |
| `/meeting/join`       | POST   | 모임 참여      | meetingId (JWT 필요)                                               | 참여 완료 메시지          |
| `/admin/stats`        | GET    | 유저별 미션 통계  | -                                                                | 이름, 미션완료율, 마지막 활동일 |
| `/diary`              | POST   | 일기 저장      | content, date, emotion (JWT 필요)                                  | 저장 완료 메시지          |
| `/mission/complete`   | POST   | 미션 완료 등록   | missionId (JWT 필요)                                               | 완료 메시지 및 저장 정보     |
