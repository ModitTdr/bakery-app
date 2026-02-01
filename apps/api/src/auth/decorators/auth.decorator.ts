import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';

export const ROLE = 'role';

//creating decorator @Role('xxx')
export const Roles = (role: Role) => SetMetadata(ROLE, role);
