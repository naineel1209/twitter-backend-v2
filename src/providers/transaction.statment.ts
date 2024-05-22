export class TransactionStatment{
   public static readonly BEGIN_WITH_SAVEPOINT: string = 'BEGIN; SAVEPOINT twitter_savepoint_1';
   public static readonly RELEASE_SAVEPOINT: string = 'RELEASE SAVEPOINT twitter_savepoint_1';
   public static readonly COMMIT: string = 'COMMIT';
   public static readonly ROLLBACK_TO_SAVEPOINT: string = 'ROLLBACK TO SAVEPOINT twitter_savepoint_1';
   public static readonly ROLLBACK: string = 'ROLLBACK';
   public static readonly SAVEPOINT_NAME: string = 'twitter_savepoint_1';
}
