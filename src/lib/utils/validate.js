import { deptList } from '@lib/constants';

function academicIDValidator(id) {
  const academicIDRegex = /^2[0-9]{8}$/g;
  if (academicIDRegex.test(id)) {
    let first4 = parseInt(id.slice(0, 4));
    let thisYear = parseInt(new Date().getFullYear());
    if (first4 > thisYear) {
      return false;
    }
  } else {
    return false;
  }

  return true;
}

function deptValidator(name) {
  return deptList.includes(name);
}

function primaryRoleValidator(role) {
  return role === 'U' || role === 'O';
}

export function validator(form) {
  if (!academicIDValidator(form.academicID)) return false;
  if (!deptValidator(form.dept)) return false;
  if (!primaryRoleValidator(form.primaryRole)) return false;
  if (!form.confirmPrivacy) return false;

  return true;
}

export function fulfilled(form) {
  return !(
    form.academicID &&
    form.dept &&
    form.primaryRole &&
    form.confirmPrivacy
  );
}
