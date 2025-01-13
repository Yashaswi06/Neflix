export const validate = (data, formType) => {
  const errors = {};

  if (!data.UserName || !data.UserName.trim()) {
    errors.UserName = "Username is required.";
  }
  if (!data.Email || !data.Email.trim()) {
    errors.Email = "Email is required.";
  } else if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      String(data.Email).toLowerCase()
    )
  ) {
    errors.Email = "Invalid email format.";
  }
  if (!data.Password || !data.Password.trim()) {
    errors.Password = "Password is required.";
  } else if (data.Password.length < 6) {
    errors.Password = "Password must be at least 6 characters.";
  }
  if (!data.ConfirmPassword || !data.ConfirmPassword.trim()) {
    errors.ConfirmPassword = "Confirm password is required.";
  } else if (data.Password !== data.ConfirmPassword) {
    errors.ConfirmPassword = "Passwords do not match.";
  }
  if (!data.PhoneNumber || !data.PhoneNumber.trim()) {
    errors.PhoneNumber = "Phone number is required.";
  } else if (!/^\d{10}$/.test(data.PhoneNumber)) {
    errors.PhoneNumber = "Phone number must be 10 digits.";
  }
  if (!data.Role || data.Role === "Select Role") {
    errors.Role = "Role is required.";
  }

  return errors;
};
