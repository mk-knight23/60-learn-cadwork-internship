import { inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';

export const databaseInitializer = () => {
  const db = inject(DatabaseService);
  return () => db.initialize();
};
