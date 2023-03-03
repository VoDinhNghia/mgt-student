import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  // Will have method get tuition of user,
  // check paymentstudyfees is null,
  // check subjectregisters of user (have register in semester),
  // create new document in paymentstudyfees(status false)
  // controller api path is /:userId
  // method create (cashier role) => check user, semester if !null => update status => true
  // if payment is online ? what is flow?
}
