import * as doctorsRepo from './doctors.repository';
import { toDoctorDtoList } from './dto';

export async function listDoctors() {
  const doctors = await doctorsRepo.findAllDoctors();
  return toDoctorDtoList(doctors);
}