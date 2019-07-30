# Описание взаимодействия с сервером

Схема работы проста: сначала необходимо инициировать поиск на сервере и получить идентификатор поиска (`searchId`). Далее, с полученным `searchId`, ты делаешь запросы для получения неотсортированных списков билетов. Обрати внимание, что билеты прилетают пачками, которые необходимо агрегировать, фильтровать и сортировать согласно выбранным в интерфейсе параметрам. Для усложнения задачи, сервер может на один из запросов ответить ошибкой.

## Получение `searchId`

Просто отправь GET-запрос на `https://front-test.beta.aviasales.ru/search` и получи его.

Пример:

Request: `https://front-test.beta.aviasales.ru/search`

Response: `{"searchId":"4niyd"}`

## Получение пачки билетов

Отправляй GET-запросы на `https://front-test.beta.aviasales.ru/tickets` и передай searchId полученный из запроса выше GET-параметром.

Пример:

Request: `https://front-test.beta.aviasales.ru/tickets?searchId=4niyd`

Response: `{tickets: [], stop: false}`

## Обработка завершения поиска

Поиск считается завершенным, когда в очередном ответе от сервера придёт значение `{stop: true}`.

Пример:

Request: `https://front-test.beta.aviasales.ru/tickets?searchId=4niyd`

Response: `{tickets: [], stop: true}`

## Структура билета

В списке `tickets` будут лежать билеты следующей структуры:

```typescript
interface Ticket {
  // Цена в рублях
  price: number
  // Код авиакомпании (iata)
  carrier: string
  // Массив перелётов.
  // В тестовом задании это всегда поиск "туда-обратно" значит состоит из двух элементов
  segments: [
    {
      // Код города (iata)
      origin: string
      // Код города (iata)
      destination: string
      // Дата и время вылета туда
      date: string
      // Массив кодов (iata) городов с пересадками
      stops: string[]
      // Общее время перелёта в минутах
      duration: number
    },
    {
      // Код города (iata)
      origin: string
      // Код города (iata)
      destination: string
      // Дата и время вылета обратно
      date: string
      // Массив кодов (iata) городов с пересадками
      stops: string[]
      // Общее время перелёта в минутах
      duration: number
    }
  ]
}
```
