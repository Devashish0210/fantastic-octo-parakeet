- [Alumni Services Backend Document](#alumni-services-backend-document)
  - [Introduction](#introduction)
  - [Deployment](#deployment)
    - [Development VM](#development-vm)
    - [Alumni Deployed VM](#alumni-deployed-vm)
  - [Libraries Installed and Set Up](#libraries-installed-and-set-up)
  - [Source Code Explanation](#source-code-explanation)
    - [tailwind.config.ts](#tailwindconfigts)
    - [.env.local](#envlocal)
    - [redux-toolkit](#redux-toolkit)
    - [Public](#public)
    - [Providers](#providers)
    - [global.css and globalIcon.css](#globalcss-and-globaliconcss)
    - [layout.tsx](#layouttsx)
    - [not-found.tsx](#not-foundtsx)
    - [loading.tsx](#loadingtsx)
    - [error.tsx](#errortsx)
    - [\_api-helpers](#_api-helpers)
      - [API Callers](#api-callers)
        - [App/\_api-helpers/checkServerStatus.ts](#app_api-helperscheckserverstatusts)
        - [App/\_api-helpers/create-ticket.ts](#app_api-helperscreate-ticketts)
        - [App/\_api-helpers/emp-details.ts](#app_api-helpersemp-detailsts)
        - [App/\_api-helpers/generate-otp.ts](#app_api-helpersgenerate-otpts)
        - [App/\_api-helpers/recaptcha-api.ts](#app_api-helpersrecaptcha-apits)
        - [App/\_api-helpers/document.ts](#app_api-helpersdocumentts)
        - [App/\_api-helpers/validate-otp.ts](#app_api-helpersvalidate-otpts)
        - [App/documents/\_api-helpers/ndc.ts](#appdocuments_api-helpersndcts)
        - [App/faqs/\_api-helpers/faq-request.ts](#appfaqs_api-helpersfaq-requestts)
        - [App/tickets/\_api-helpers/create-ticket.ts](#apptickets_api-helperscreate-ticketts)
        - [App/tickets/\_api-helpers/get-ticket.ts](#apptickets_api-helpersget-ticketts)
        - [App/tickets/\_api-helpers/smc-cat.ts](#apptickets_api-helperssmc-catts)
        - [App/employee-verification/\_api-helpers/ResendButton.ts](#appemployee-verification_api-helpersresendbuttonts)
        - [App/employee-verification/\_api-helpers/sendEmail.ts](#appemployee-verification_api-helperssendemailts)
        - [App/employee-verification/\_api-helpers/sendVerificationBackend.ts](#appemployee-verification_api-helperssendverificationbackendts)
        - [App/employee-verification/\_api-helpers/validateOtp.ts](#appemployee-verification_api-helpersvalidateotpts)
      - [API Utils](#api-utils)
        - [App/employee-verification/\_api-helpers/setCookie.ts or App/\_api-helpers/CookieSet.ts](#appemployee-verification_api-helperssetcookiets-or-app_api-helperscookiesetts)
        - [App/employee-verification/\_api-helpers/logout.ts or App/\_api-helpers/logut.ts](#appemployee-verification_api-helperslogoutts-or-app_api-helperslogutts)
        - [App/employee-verification/\_api-helpers/ProceedClick.ts](#appemployee-verification_api-helpersproceedclickts)
        - [App/employee-verification/\_api-helpers/validateEmail.ts](#appemployee-verification_api-helpersvalidateemailts)
    - [\_components](#_components)
      - [App/\_components/htmlcomponent.tsx](#app_componentshtmlcomponenttsx)
      - [App/\_components/LoadingButton.tsx](#app_componentsloadingbuttontsx)
      - [App/\_components/Recaptcha.tsx](#app_componentsrecaptchatsx)
      - [App/\_components/link-tabs.tsx](#app_componentslink-tabstsx)
      - [App/\_components/name-component.tsx](#app_componentsname-componenttsx)
      - [App/\_components/triangle.tsx](#app_componentstriangletsx)
      - [App/\_components/MovingMessage.tsx](#app_componentsmovingmessagetsx)
      - [App/\_components/login-card.tsx](#app_componentslogin-cardtsx)
      - [App/\_components/otp-auth.tsx](#app_componentsotp-authtsx)
      - [App/\_components/PageNotFound.tsx](#app_componentspagenotfoundtsx)
      - [App/\_components/link-tabs-data.ts](#app_componentslink-tabs-datats)
      - [App/\_components/login-page.tsx](#app_componentslogin-pagetsx)
      - [App/\_components/themetoggler.tsx](#app_componentsthemetogglertsx)
    - [\_layout\_components](#_layout_components)
      - [App/\_components/footer.tsx](#app_componentsfootertsx)
      - [App/\_components/navbar-login-main.tsx](#app_componentsnavbar-login-maintsx)
      - [App/\_components/page-authentication-bgv.tsx](#app_componentspage-authentication-bgvtsx)
      - [App/\_components/page-container.tsx](#app_componentspage-containertsx)
      - [App/\_components/navbar-login-bgv.tsx](#app_componentsnavbar-login-bgvtsx)
      - [App/\_components/navbar.tsx](#app_componentsnavbartsx)
      - [App/\_components/page-authenticator-main.tsx](#app_componentspage-authenticator-maintsx)
    - [App/actions/\_components](#appactions_components)
      - [App/actions/\_components/ActionsPage.tsx](#appactions_componentsactionspagetsx)
      - [App/actions/\_components/card.tsx](#appactions_componentscardtsx)
      - [App/actions/\_components/details-card.tsx](#appactions_componentsdetails-cardtsx)
    - [App/documents/\_components](#appdocuments_components)
      - [App/documents/\_components/DocumentsPage.tsx](#appdocuments_componentsdocumentspagetsx)
      - [App/documents/\_components/RequestForm.tsx](#appdocuments_componentsrequestformtsx)
      - [App/documents/\_components/document.ts](#appdocuments_componentsdocumentts)
      - [App/documents/\_components/request-card2-subcard.tsx](#appdocuments_componentsrequest-card2-subcardtsx)
      - [App/documents/\_components/DocumentsTab.tsx](#appdocuments_componentsdocumentstabtsx)
      - [App/documents/\_components/Table.tsx](#appdocuments_componentstabletsx)
      - [App/documents/\_components/request-card2.tsx](#appdocuments_componentsrequest-card2tsx)
    - [App/employee-verification/\_components](#appemployee-verification_components)
      - [App/employee-verification/\_components/LoginCard.tsx](#appemployee-verification_componentslogincardtsx)
      - [App/employee-verification/\_components/ModalComponent.tsx](#appemployee-verification_componentsmodalcomponenttsx)
      - [App/employee-verification/\_components/RecaptchaComponent.tsx](#appemployee-verification_componentsrecaptchacomponenttsx)
      - [App/employee-verification/\_components/RequestForm.tsx](#appemployee-verification_componentsrequestformtsx)
      - [App/employee-verification/\_components/otp-auth.tsx](#appemployee-verification_componentsotp-authtsx)
      - [App/employee-verification/VerifyComponent.tsx](#appemployee-verificationverifycomponenttsx)
    - [App/faqs/\_components](#appfaqs_components)
      - [App/faqs/\_components/FaqPage.tsx](#appfaqs_componentsfaqpagetsx)
      - [App/faqs/\_components/data.ts](#appfaqs_componentsdatats)
      - [App/faqs/\_components/FaqTab2.tsx](#appfaqs_componentsfaqtab2tsx)
      - [App/faqs/\_components/CustomCSSAccordian.tsx and #### App/faqs/\_components/faqAccordian.css](#appfaqs_componentscustomcssaccordiantsx-and--appfaqs_componentsfaqaccordiancss)
      - [App/faqs/\_components/FaqAccordian.tsx](#appfaqs_componentsfaqaccordiantsx)
    - [App/tickets/\_components](#apptickets_components)
      - [App/tickets/\_components/CustomDropzone.tsx](#apptickets_componentscustomdropzonetsx)
      - [App/tickets/\_components/Dropdown.tsx](#apptickets_componentsdropdowntsx)
      - [App/tickets/\_components/LoadingButton.tsx](#apptickets_componentsloadingbuttontsx)
      - [App/tickets/\_components/RequestForm.tsx](#apptickets_componentsrequestformtsx)
      - [App/tickets/\_components/Table.tsx](#apptickets_componentstabletsx)
      - [App/tickets/\_components/TicketsPage.tsx](#apptickets_componentsticketspagetsx)
      - [App/tickets/\_components/TicketsTab.tsx](#apptickets_componentsticketstabtsx)
    - [Page.tsx](#pagetsx)

# Alumni Services Backend Document

## Introduction

This application is specifically built for ex-employees of microland. It is via this website that they can access their documents such as payslips, form 16, relieving letter, experience letter, etc. This application also has a portal for employee verification, which can be used by HRs of the company that the employee is currently working in to verify the employee's status in microland (Resigned – when, why, etc.).

## Deployment

The commands used for deployment are as follows:

### Development VM

```bash
docker build . -t aicoedevconreg.azurecr.io/{project_name}:{version.version.version}
```

```bash
az login --use-device-code
```

````bash
az acr login --name aicoedevconreg.azurecr.io
```bash
docker push aicoedevconreg.azurecr.io/ {project_name}:{version.version.version}
````

### Alumni Deployed VM

```bash
az login --use-device-code
```

```bash
az acr login --name aicoedevconreg.azurecr.io
```

Change docker-compose image property to correct image with correct tag

```bash
docker compose up -d
```

## Libraries Installed and Set Up

- React
- Next
- NextUI
- Redux
- Redux-toolkit
- Typescript
- Tailwind
- React-dropzone
- react-social-icons

## Source Code Explanation

### tailwind.config.ts

Using NextJs's default tailwind config + added nextui Plugin

### .env.local

Hold env variables that needs to be filled in by user. These variables hold important values and secrets, that’s why this file is not committed anywhere.

### redux-toolkit

Redux toolkit Standard code with store.ts holding redux store config code, hooks.ts holding the useselector and useDispatch custom typed hooks, and features folder holding files that contain redux-toolkit slices code.

### Public

Holds files to be served to the client's web browser.

### Providers

Holding files for redux and nextUI providers which are used in layout (wrapper around each page). The providers enable use of the specific library's functionality.

### global.css and globalIcon.css

Holds css code that is applied globally, in this case tailwind classes and google icons class.

### layout.tsx

Holds code that is applied to each page like navbar and footer.

### not-found.tsx

Holds code for the page, that should be rendered whenever a user goes to a url that does not exist.

### loading.tsx

The special file loading.tsx helps you create meaningful Loading UI with React Suspense. With this convention, you can show an instant loading state from the server while the content of a route segment loads. The new content is automatically swapped in once rendering is complete.

### error.tsx

The error.tsx file convention allows you to gracefully handle unexpected runtime errors in nested routes.

Automatically wrap a route segment and its nested children in a React Error Boundary.

Create error UI tailored to specific segments using the file-system hierarchy to adjust granularity.

Isolate errors to affected segments while keeping the rest of the application functional.

Add functionality to attempt to recover from an error without a full page reload.

### \_api-helpers

These folders contain code for api calls and code to handle all the exceptions related to it. Each endpoint has all its associated \_api-helpers in its own workspace that results in multiple folders with same name placed at different location.

#### API Callers

These are the files that have functions that make a call to the api and handle the responses. These functions are directly used by the components. The have a common format which is:

Make a request with the required headers.

If the request requires auth, the response might result in expiry status code 403. In such cases, log the user out.

If there is some other error handle that.

Respond with the object if everything proceeds smoothly.

All such files are as follows:

##### App/\_api-helpers/checkServerStatus.ts

    It checks if backend is up or not and accordingly returns true or false.

##### App/\_api-helpers/create-ticket.ts

    It makes a post request with ticket body thereby creating ticket if all verifications succeed and accordingly returns true or false.

##### App/\_api-helpers/emp-details.ts

    It retrieves the employee details and return that object.

##### App/\_api-helpers/generate-otp.ts

    It makes a post request to generate otp based on the information user entered during login. If the info validates then OTP is generated, otherwise not.

##### App/\_api-helpers/recaptcha-api.ts

    Validates google Recaptcha.

##### App/\_api-helpers/document.ts

    Sends the request to the backend for sending the requested document to the user's mail (e.g. pay slips).

##### App/\_api-helpers/validate-otp.ts

    Checks if OTPis still valid or not.

##### App/documents/\_api-helpers/ndc.ts

    Gets the ndc object from backend. The object contains the status and comments of all relevant parties.

##### App/faqs/\_api-helpers/faq-request.ts

    Gets the list of faqs from the backend.

##### App/tickets/\_api-helpers/create-ticket.ts

    Post request to create a ticket.

##### App/tickets/\_api-helpers/get-ticket.ts

    Gets the list of tickets already created with their details and status.

##### App/tickets/\_api-helpers/smc-cat.ts

    Gets the list of categories that are available to the user for creating a ticket.

##### App/employee-verification/\_api-helpers/ResendButton.ts

    Its button which can be used to resend otp a maximum of 2 times. It turns green on success and red of error.

##### App/employee-verification/\_api-helpers/sendEmail.ts

    It is used generate OTP for employment verification using the email user entered.

##### App/employee-verification/\_api-helpers/sendVerificationBackend.ts

    It is used to verify whether empID and lwd match and if they do then the user receives the employment verification mail.

##### App/employee-verification/\_api-helpers/validateOtp.ts

    It is used to verify whether the employment verification OTP is valid or not.

#### API Utils

Functions that are useful for the api calls or are related to them.

##### App/employee-verification/\_api-helpers/setCookie.ts or App/\_api-helpers/CookieSet.ts

    Its a function used to set cookies in the web browser.

##### App/employee-verification/\_api-helpers/logout.ts or App/\_api-helpers/logut.ts

    This function in thier respective files, remove the cookies(1st one removes employer_login_state, and the second one removes employee_login_state), change the hooks state to null, and redirect to the home page.

##### App/employee-verification/\_api-helpers/ProceedClick.ts

    Checks if email is okay in employee verification portal, if it is then shows captcha.

##### App/employee-verification/\_api-helpers/validateEmail.ts

    Regex to verify email input.

### \_components

#### App/\_components/htmlcomponent.tsx

    This component is a wrapper component which wraps its children around with html tag with classname set to “dark” or “light” depending on the hook value of theme object.

#### App/\_components/LoadingButton.tsx

    This component returns a button that on clicking loads till the action completes and on success turns green and on error turns red.

#### App/\_components/Recaptcha.tsx

    It returns google’s recaptcha 2 configured component.

#### App/\_components/link-tabs.tsx

    This component creates custom styled navigation tabs based on the data passed to it.

#### App/\_components/name-component.tsx

    The component return holds the employees name that has been styled. It uses hooks to figure out the employee’s name.

#### App/\_components/triangle.tsx

    returns svg of a red inverted triangle.

#### App/\_components/MovingMessage.tsx

    Wraps around a text tag, and whatever’s written inside it is styled such that it creates a moving message look.

#### App/\_components/login-card.tsx

    Return a card that holds the form that user must fill in to login. This is login for Alumni Services.

#### App/\_components/otp-auth.tsx

    Return a card that holds the form which has an OTP field. This field must be filled to verify the user’s identity.

#### App/\_components/PageNotFound.tsx

    This component is rendered when user tries to go to a URL that doesn’t exist.

#### App/\_components/link-tabs-data.ts

    Holds the data for link tab navigation, as it's predetermined no need to call backend.

#### App/\_components/login-page.tsx

    This holds the code for login page, internally uses login card with background image and text.

#### App/\_components/themetoggler.tsx

    It's a component that when clicked changes the theme from light to dark and vice versa.

### \_layout_components

#### App/\_components/footer.tsx

    Component for the footer that is rendered in each page.

#### App/\_components/navbar-login-main.tsx

    This is the navbar component that is used when an employee logs in Alumni Services.

#### App/\_components/page-authentication-bgv.tsx

    This component conditionally renders the right navbar depending on the login status in employee verification portal.

#### App/\_components/page-container.tsx

    This is the main navbar component that based on the url path decides which authenticator to call.

#### App/\_components/navbar-login-bgv.tsx

    This is the navbar component that is used when an employee logs in Employee Verification portal.

#### App/\_components/navbar.tsx

    This is the navbar component that is used when an employee isn’t logged in.

#### App/\_components/page-authenticator-main.tsx

    This component conditionally renders the right navbar depending on the login status in Alumni Services.

### App/actions/\_components

#### App/actions/\_components/ActionsPage.tsx

    This is the main component of the action page as it organizes all the cards and forms the action page.

#### App/actions/\_components/card.tsx

    The action page has multiple similar cards. This component takes in some parameters and creates a card with desired styling.

#### App/actions/\_components/details-card.tsx

    This component is an employee detail card specifying what employee name, designation, LWD, etc.

### App/documents/\_components

#### App/documents/\_components/DocumentsPage.tsx

    This is the main component of the documents page as it organizes all the components.

#### App/documents/\_components/RequestForm.tsx

    This component takes in the data from document.ts (if an endpoint was available then from there) and creates a container with n number of Customcards that hold the details of n different types of documents category.

#### App/documents/\_components/document.ts

    Holds the data about different documents and their categories.

#### App/documents/\_components/request-card2-subcard.tsx

    This is a subcard inside the main request card, this card represents a button with optional text. Is used to specify each document in a category.

#### App/documents/\_components/DocumentsTab.tsx

    This component uses nextui tab component to create two mini pages, one with list of documents and other that has table with ndc details.

#### App/documents/\_components/Table.tsx

    This component uses nextui’s table to represent ndc details.

#### App/documents/\_components/request-card2.tsx

    This component is a card that holds sub cards that are clickable with descriptions. Each of these sub cards represents one document.

### App/employee-verification/\_components

#### App/employee-verification/\_components/LoginCard.tsx

    Return a card that holds the form that user must fill in to login. This is login for Employee Verfication Portal.

#### App/employee-verification/\_components/ModalComponent.tsx

    This component is modal that pops up showing whether the data input in the request is correct or not, if it correct it will inform about the mail sent else display the mismatch message.

#### App/employee-verification/\_components/RecaptchaComponent.tsx

    It returns google’s recaptcha 2 configured component.

#### App/employee-verification/\_components/RequestForm.tsx

    This component is a card with two fields, Last working day and employee ID. If both fields match and are correct, then employee status is mailed to user.

#### App/employee-verification/\_components/otp-auth.tsx

    Return a card that holds the form which has an OTP field. This field must be filled to verify the user’s identity.

#### App/employee-verification/VerifyComponent.tsx

    This is the main component of the verification page as it organizes all the components. When to display login and when to display request form.

### App/faqs/\_components

#### App/faqs/\_components/FaqPage.tsx

    This is the main component of the faqs page as it organizes all the components.

#### App/faqs/\_components/data.ts

    Holds different colors that can be used for different categories of faqs.

#### App/faqs/\_components/FaqTab2.tsx

    Creates several cards based on the categories of the faqs received from the backend. Each card is a tab, meaning this component also keeps track of which category is selected. Based on the category selection it displays all the faqs in that category below the cards in the form of an accordian.

#### App/faqs/\_components/CustomCSSAccordian.tsx and #### App/faqs/\_components/faqAccordian.css

    These two files are used as wrapper to apply styles to the html tags in general. All the children of this component will have those styles applied to the tags.

#### App/faqs/\_components/FaqAccordian.tsx

    This component uses the data received to configure nextui’s accordion. Basically, an accordion for faqs.

### App/tickets/\_components

#### App/tickets/\_components/CustomDropzone.tsx

    This is a component that uses react-dropzone hooks and library to create a custom style and configure dropzone. A dropzone is where you drop your files or upload them from file manager.

#### App/tickets/\_components/Dropdown.tsx

    This component uses nextui’s dropdown to create custom styled and configured dropzone, which is further used an input for the list of categories in ticket creation. By categories, I mean, type of ticket you want to create, eg – CIS related ticket.

#### App/tickets/\_components/LoadingButton.tsx

    This component returns a button that on clicking loads till the action completes and on success turns green and on error turns red.

#### App/tickets/\_components/RequestForm.tsx

    This component is a card (which represents a form) with three fields, category dropdown input, description input and drop zone input. This form is used for creating a ticket.

#### App/tickets/\_components/Table.tsx

    This component uses nextui’s table to represent tickets details. These details include ticket id, status, description etc.

#### App/tickets/\_components/TicketsPage.tsx

    This is the main component of the tickets page as it organizes all the components.

#### App/tickets/\_components/TicketsTab.tsx

    This component uses nextui tab component to create two mini pages, one that contains a form for ticket creation and other that has a table with details of tickets that have already been created.

### Page.tsx

It is the page component that is rendered for a URL. So, this is the main component of each endpoint.
