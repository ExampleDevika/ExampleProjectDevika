import { Status, Todo } from '@baseline/types/todo';
import {
  getDynamodbConnection,
  queryItems,
  queryItemsRange,
} from '@baselinejs/dynamodb';
import { ServiceObject } from '../../util/service-object';

const dynamoDb = getDynamodbConnection({
  region: `${process.env.API_REGION}`,
});

export const todoService = new ServiceObject<Todo>({
  dynamoDb: dynamoDb,
  objectName: 'Todo',
  table: `${process.env.APP_NAME}-${process.env.NODE_ENV}-todo`,
  primaryKey: 'todoId',
});

export const getTodoByUserIdAndStatus = async (
  userId: string,
  status: Status,
): Promise<Todo[]> => {
  const response = await queryItemsRange<Todo>({
    dynamoDb: dynamoDb,
    table: todoService.table,
    indexName: 'userId-status-index',
    keyName: 'userId',
    keyValue: userId,
    rangeKeyName: 'status',
    rangeKeyValue: status,
  });

  return response;
};
