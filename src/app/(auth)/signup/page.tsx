"use client";

import React, { useCallback, useEffect, useState, Fragment } from "react";
import { CiMail } from "react-icons/ci";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare, FaGithub } from "react-icons/fa";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Redressed } from "next/font/google";
import { UserType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useDebounce from "@/helpers/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ReloadIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { interests } from "@/configs/interests";
import { languages } from "@/configs/languages";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const userBackup = JSON.parse(localStorage.getItem("userbackup") || "{}");
  const router = useRouter();
  const [outerDialog, setOuterDialog] = useState(false);
  const [innerDialog, setInnerDialog] = useState(false);
  const [emailDialog, setEmailDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameAvaiable, setNameAvaiable] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // _________ Main values user data state __________

  const [values, setValues] = useState<UserType>({
    username: userBackup.username ?? "",
    email: userBackup.email ?? "",
    gender: userBackup.gender ?? "male",
    birthday: userBackup.birthday ?? "",
    interests: userBackup.interests ?? [],
    languages: userBackup.languages ?? [],
    location: userBackup.location ?? {},
  });
  // _________ Search Related _________

  const debounceSearch = useDebounce({
    value: (values.username || values.email) ?? "",
    delay: 500,
  });
  const [searchLanguage, setSearchLanguage] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<any>({
    language: "",
    proficiency: "",
  });

  // Define the signup steps and their corresponding paths
  const steps = {
    step1: "/step1",
    step2: "/step2",
    step3: "/step3",
    step4: "/step4",
    step5: "/step5",
  };
  const searchUsername = useCallback(async () => {
    if (debounceSearch.trim().length === 0 || currentStep > 1) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/auth/unique-username?username=${debounceSearch}`
      );
      const data = await response.json();
      if (data && data.success) {
        toast.success(data.message);
        setNameAvaiable(true);
      } else {
        toast.error(data.message);
        setNameAvaiable(false);
      }
      return data;
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, [debounceSearch, currentStep]);

  useEffect(() => {
    searchUsername();
  }, [searchUsername]);

  useEffect(() => {
    const userBackup = localStorage.getItem("userbackup");
    if (userBackup) {
      const parsedBackup = JSON.parse(userBackup);
      const { currentStep, nameAvailabe, ...rest } = parsedBackup;
      setValues(rest);

      setNameAvaiable(parsedBackup.nameAvaiable);
    }
  }, []);

  // Create an array of paths up to the current step
  const pathNames = Object.values(steps).slice(0, currentStep);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValues({ ...values, username: value });
    localStorage.setItem(
      "userbackup",
      JSON.stringify({ ...values, username: value, nameAvaiable })
    );
  };
  useEffect(() => {
    if (currentStep === 4) {
      const getLocation = async () => {
        try {
          setLoading(true);
          const response = await fetch(`https://ipapi.co/json/`);
          const data = await response.json();
          if (data) {
            setValues({
              ...values,
              location: {
                ...values.location,
                country: data?.country_name,
              },
            });
            localStorage.setItem(
              "userbackup",
              JSON.stringify({
                ...values,
                location: {
                  ...values.location,
                  country: data?.country_name,
                },

                nameAvaiable,
              })
            );
          }
          return data;
        } catch (error) {
          console.log("error", error);
          toast.error("Something went wrong while getting country name");
        } finally {
          setLoading(false);
        }
      };
      getLocation();
    }
  }, [currentStep]);

  const handleSignupUser = async () => {
    setNameAvaiable(null);
    // TODO: validate the user data
    console.log("values", values);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      });
      const data = await res.json();
      console.log("data", data);
      if (data.success) {
        toast.success(data.message);
        // rediret to verify page
        router.push("/verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong , please try again later ☹️");
      setEmailDialog(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <Breadcrumb className="sticky top-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/signup">Signup</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {pathNames.map((path, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <span
                    onClick={() => setCurrentStep(index + 1)}
                    className={`capitalize cursor-pointer ${
                      index === pathNames.length - 1
                        ? "text-slate-700 dark:text-slate-300 font-medium"
                        : ""
                    }`}
                  >
                    {`Step ${index + 1}`}
                  </span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < pathNames.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="border bg-[#09090b] rounded-md p-4 md:px-6 md:py-8">
        {currentStep === 1 ? (
          <div className="space-y-5">
            {/* _____ Username _____ */}
            <div className="grid w-full  items-center gap-1.5">
              <label htmlFor="name" className="font-semibold">
                Username
              </label>
              <div className="flex relative items-center">
                <Input
                  value={values.username}
                  onChange={handleUsernameChange}
                  autoComplete="off"
                  type="text"
                  id="name"
                  placeholder="This is your public display name."
                />
                {loading ? (
                  <ReloadIcon className="text-green-500 animate-spin absolute right-4" />
                ) : nameAvaiable && !loading && values.username ? (
                  <CheckCircledIcon className="text-green-500 absolute right-4" />
                ) : (
                  nameAvaiable == false &&
                  !loading &&
                  values.username && (
                    <ExclamationTriangleIcon className="text-red-500 absolute right-4" />
                  )
                )}
              </div>
            </div>
            {/* ____ Gender ___ */}
            <div className="gender space-y-2">
              <label className="font-semibold">Gender</label>
              <div className="w-full pl-5">
                <RadioGroup
                  defaultValue="male"
                  onValueChange={(value: "male" | "female" | "non-binary") => {
                    setValues({
                      ...values,
                      gender: value,
                    });
                    localStorage.setItem(
                      "userbackup",
                      JSON.stringify({
                        ...values,
                        gender: value,

                        nameAvaiable,
                      })
                    );
                  }}
                >
                  <div className="flex items-center space-x-2 ">
                    <RadioGroupItem value="male" id="r1" />
                    <Label htmlFor="r1" className="cursor-pointer">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 ">
                    <RadioGroupItem value="female" id="r2" />
                    <Label htmlFor="r2" className="cursor-pointer">
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 ">
                    <RadioGroupItem value="non-binary" id="r3" />
                    <Label htmlFor="r3" className="cursor-pointer">
                      Non-Binary
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            {/* ____ DATE OF BIRTH ____ */}
            <div className="space-y-1">
              <label className="font-semibold">Date of birth</label>
              <input
                type="date"
                value={values.birthday ? values.birthday.toString() : ""}
                className="w-full border border-gray-300 dark:border-slate-800 bg-inherit rounded-md p-2"
                onChange={(e) => {
                  setValues({ ...values, birthday: e.target.value });
                  localStorage.setItem(
                    "userbackup",
                    JSON.stringify({
                      ...values,
                      birthday: e.target.value,

                      nameAvaiable,
                    })
                  );
                }}
              />
            </div>
          </div>
        ) : // Step 2
        currentStep === 2 ? (
          <div className="space-y-5">
            <div className="mb-5">
              <h1
                className={`text-start text-2xl font-medium text-slate-800 dark:text-slate-300`}
              >
                Pick some topics you are interested in.
              </h1>
              <p className="text-slate-600 text-sm dark:text-slate-400">
                We will use them to match with others based on common interests.
              </p>
            </div>
            <div className="interests grid grid-cols-2 gap-3 max-h-[30rem] overflow-auto ">
              {interests?.map((interest, index) => {
                return (
                  <span
                    key={interest + index}
                    onClick={() => {
                      if (values?.interests?.includes(interest)) {
                        setValues({
                          ...values,
                          interests: values?.interests?.filter(
                            (item) => item !== interest
                          ),
                        });
                        localStorage.setItem(
                          "userbackup",
                          JSON.stringify({
                            ...values,
                            interests: values?.interests?.filter(
                              (item) => item !== interest
                            ),

                            nameAvaiable,
                          })
                        );
                        return;
                      }
                      setValues({
                        ...values,
                        interests: [...(values?.interests ?? []), interest],
                      });
                      localStorage.setItem(
                        "userbackup",
                        JSON.stringify({
                          ...values,
                          interests: [...(values?.interests ?? []), interest],
                          currentStep,
                          nameAvaiable,
                        })
                      );
                    }}
                    className={`col-span-1 border
                          ${
                            values?.interests?.includes(interest)
                              ? "bg-yellow-500 text-white dark:text-black"
                              : "hover:bg-slate-100 dark:hover:bg-slate-700 bg-slate-900"
                          }
                           rounded-md text-sm px-3 py-3 cursor-pointer `}
                  >
                    {interest}
                  </span>
                );
              })}
            </div>
          </div>
        ) : // Step 3 ( Languages )
        currentStep === 3 ? (
          <div className="space-y-5">
            <div className="mb-5 space-y-2">
              <h1
                className={`text-start text-2xl font-medium text-slate-800 dark:text-slate-300`}
              >
                Languages
              </h1>
              <p className="text-slate-600 text-sm dark:text-slate-400">
                You may add more than one.
              </p>
            </div>

            <div className="languages gap-3 space-y-2">
              {values?.languages?.map((val, index) => {
                return (
                  <div
                    key={index}
                    className={` flex justify-between   border rounded-md text-sm px-3 py-3`}
                  >
                    <div className="flex flex-col gap-y-2">
                      <Label>{val.language}</Label>
                      <span className="text-xs opacity-40 capitalize">
                        {val.proficiency}
                      </span>
                    </div>
                    <div>
                      <CrossCircledIcon
                        onClick={() => {
                          setValues({
                            ...values,
                            languages: values?.languages?.filter(
                              (item) => item.language !== val.language
                            ),
                          });
                        }}
                        className="text-red-500 size-4 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <Dialog open={outerDialog} onOpenChange={setOuterDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full ">
                  Add Language
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Language</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-5 mt-3">
                  <Label htmlFor="name" className="text-right">
                    Search
                  </Label>
                  <Input
                    id="name"
                    value={searchLanguage}
                    className="w-full"
                    onChange={(e) => {
                      setSearchLanguage(e.target.value);
                    }}
                    placeholder="Search for a language"
                  />
                </div>
                <div className="searchedLanguage grid grid-cols-1 gap-2 max-h-[10rem] overflow-auto">
                  {languages
                    ?.filter((lang) =>
                      lang.toLowerCase().includes(searchLanguage.toLowerCase())
                    )
                    ?.map((lang, index) => (
                      <Dialog
                        key={index}
                        open={innerDialog}
                        onOpenChange={setInnerDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            disabled={values?.languages?.some(
                              (item) => item.language === lang
                            )}
                            variant="outline"
                            className="w-full flex justify-between active:bg-opacity-40"
                            onClick={() => {
                              setSelectedLanguage({
                                language: lang,
                                proficiency: "beginner",
                              });
                            }}
                          >
                            <span>{lang}</span>
                            {values?.languages?.some(
                              (item) => item.language === lang
                            ) ? (
                              <CheckCircledIcon className="text-green-500" />
                            ) : (
                              <span>+</span>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] py-5">
                          <DialogHeader>
                            <DialogTitle className="text-center">
                              {" "}
                              {selectedLanguage.language}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="my-5 space-y-4">
                            <DialogDescription>Proficiency</DialogDescription>
                            <RadioGroup
                              className="space-y-2"
                              defaultValue="beginner"
                              onValueChange={(
                                value:
                                  | "interested"
                                  | "beginner"
                                  | "intermediate"
                                  | "advanced"
                                  | "fluent"
                                  | "native"
                              ) =>
                                setSelectedLanguage({
                                  language: selectedLanguage.language,
                                  proficiency: value,
                                })
                              }
                            >
                              <div className="flex items-center space-x-2 ">
                                <RadioGroupItem value="beginner" id="r1" />
                                <Label htmlFor="r1" className="cursor-pointer">
                                  Beginner
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 ">
                                <RadioGroupItem value="intermediate" id="r2" />
                                <Label htmlFor="r2" className="cursor-pointer">
                                  Intermediate
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 ">
                                <RadioGroupItem value="advanced" id="r3" />
                                <Label htmlFor="r3" className="cursor-pointer">
                                  Advanced
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 ">
                                <RadioGroupItem value="fluent" id="r4" />
                                <Label htmlFor="r4" className="cursor-pointer">
                                  Fluent
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 ">
                                <RadioGroupItem value="native" id="r5" />
                                <Label htmlFor="r5" className="cursor-pointer">
                                  Native
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 ">
                                <RadioGroupItem value="interested" id="r6" />
                                <Label htmlFor="r6" className="cursor-pointer">
                                  Interested
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => {
                                setValues({
                                  ...values,
                                  languages: [
                                    ...(values?.languages ?? []),
                                    selectedLanguage,
                                  ],
                                });
                                setInnerDialog(false);
                                setOuterDialog(false);
                                localStorage.setItem(
                                  "userbackup",
                                  JSON.stringify({
                                    ...values,
                                    languages: [
                                      ...(values?.languages ?? []),
                                      selectedLanguage,
                                    ],

                                    nameAvaiable,
                                  })
                                );
                              }}
                            >
                              Add
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ))}
                  {languages?.filter((lang) =>
                    lang.toLowerCase().includes(searchLanguage.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center">No languages found</div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : // Step 4 (Location)
        currentStep === 4 ? (
          <div className="space-y-5">
            <div className="mb-5 space-y-2">
              <h1
                className={`text-start text-2xl font-medium text-slate-800 dark:text-slate-300`}
              >
                Location
              </h1>
              <p className="text-slate-600 text-sm dark:text-slate-400">
                Where are you from?
              </p>
            </div>

            <div className="location">
              <div className="grid w-full space-y-3  items-center gap-1.5">
                {loading && (
                  <span className="flex gap-x-4 items-center text-xs opacity-45">
                    Loading country name{" "}
                    <ReloadIcon className="animate-spin size-3" />
                  </span>
                )}
                <div className="space-y-1">
                  <Label htmlFor="name" className="font-semibold">
                    Country
                  </Label>

                  <Input
                    value={values.location?.country || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setValues({
                        ...values,
                        location: {
                          ...values.location,
                          country: e.target.value,
                        },
                      });
                      localStorage.setItem(
                        "userbackup",
                        JSON.stringify({
                          ...values,
                          location: {
                            ...values.location,
                            country: e.target.value,
                          },

                          nameAvaiable,
                        })
                      );
                    }}
                    autoComplete="off"
                    type="text"
                    id="name"
                    placeholder="Which country are you from?"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name" className="font-semibold">
                    State
                  </Label>
                  <div className="flex relative items-center">
                    <Input
                      value={values.location?.state || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValues({
                          ...values,
                          location: {
                            ...values.location,
                            state: e.target.value,
                          },
                        });
                        localStorage.setItem(
                          "userbackup",
                          JSON.stringify({
                            ...values,
                            location: {
                              ...values.location,
                              state: e.target.value,
                            },

                            nameAvaiable,
                          })
                        );
                      }}
                      autoComplete="off"
                      type="text"
                      id="name"
                      placeholder={
                        (values?.location?.country?.length ?? 0) > 0
                          ? `Which state are you from in ${values.location?.country}`
                          : "Which state are you from?"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Step 5
          currentStep === 5 && (
            <div className="space-y-3">
              <div className="mb-5 space-y-2">
                <h1
                  className={`text-start text-2xl font-medium text-slate-800 dark:text-slate-300`}
                >
                  Account Connection
                </h1>
                <p className="text-slate-600 text-sm dark:text-slate-400">
                  Please choose a way to connect with your account.
                </p>
              </div>

              {/* _______ Sign Up with Email ______ */}
              <div className="email flex justify-between w-full">
                <div className="flex items-center gap-x-2 md:gap-x-4">
                  <CiMail />
                  <span>Sign Up with email</span>
                </div>

                <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEmailDialog(true);
                      }}
                    >
                      Connect
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Sign Up with Email</DialogTitle>
                    </DialogHeader>
                    <div className="my-5 space-y-4">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        disabled={loading}
                        name="email"
                        id="email"
                        autoComplete="off"
                        value={values.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setValues({ ...values, email: e.target.value });
                        }}
                        placeholder="Enter your email address"
                      />
                      <DialogDescription>
                        We will send a Otp to your email. The otp will expire in
                        1 hour.
                      </DialogDescription>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleSignupUser}
                        className="flex items-center gap-x-2"
                        disabled={loading}
                      >
                        Connect{" "}
                        {loading && (
                          <ReloadIcon className="animate-spin size-3" />
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-center text-sm">or</div>

              {/* ___________ OAUTH ____________ */}
              <div className="oauth space-y-3 border-t border-b py-4 ">
                {/*_____ Google _____*/}

                <div className="google flex justify-between w-full">
                  <div className="flex items-center gap-x-2 md:gap-x-4">
                    <FcGoogle />
                    <span>Google</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      toast.info("Coming soon");
                    }}
                  >
                    Connect
                  </Button>
                </div>
                {/* _____ Github _____ */}

                <div className="github flex justify-between w-full">
                  <div className="flex items-center gap-x-2 md:gap-x-4">
                    <FaGithub />
                    Github
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      toast.info("Coming soon");
                    }}
                  >
                    Connect
                  </Button>
                </div>
                {/* _____ Facebook _____ */}

                <div className="facebook flex justify-between w-full">
                  <div className="flex items-center gap-x-2 md:gap-x-4">
                    <FaFacebookSquare />
                    Facebook
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      toast.info("Coming soon");
                    }}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          )
        )}

        {/* __________ Buttons __________ */}
        <div className="w-full flex relative my-4 md:my-6 min-h-8">
          {currentStep > 1 && (
            <Button
              variant={"secondary"}
              className="left-0 absolute"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              Back
            </Button>
          )}
          {currentStep !== 5 && (
            <Button
              variant={"default"}
              className="right-0 absolute"
              onClick={() => {
                if (currentStep === 1) {
                  if (!nameAvaiable || !values.birthday) {
                    toast.error("Please fill in all the fields");
                    return;
                  }
                } else if (currentStep === 2) {
                  if ((values?.interests ?? []).length < 3) {
                    toast.error("Select at least 3 interests");
                    return;
                  }
                } else if (currentStep === 3) {
                  if ((values?.languages ?? []).length < 1) {
                    toast.error("Select at least 1 language");
                    return;
                  }
                } else if (currentStep === 4) {
                  if (!values.location?.country && !values.location?.state) {
                    toast.error("Please fill in all the fields");
                    return;
                  }
                }
                setCurrentStep(currentStep + 1);
              }}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      <div className="extras flex gap-x-2 opacity-90">
        Already have an account?
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
