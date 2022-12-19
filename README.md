# Takehome Assignment  

To run the app, first clone the repo and then run the following commands:

```
cd Takehome  
npm install  
npm run serve
```
If you prefer to run the production version instead, run the following commands:
```
cd Takehome  
npm install  
npm run build
```
and then open the `index.html` inside the `compiled` directory with a browser.

---

## Implemented features

### Required features  
All required features have been implemented as specified in the guidelines.  

### Stretch features  
Below is the list of features implemented with explanations.  
  

**_Pagination_**  
The user list is paginated. The number of results per page can also be chosen in the UI. Since only two API calls were provided, currently all the users fetched by the respective API calls (different for with/without search terms) are kept in the main memory and only a selected few are being shown based on the page no and results per page. However, ideally there would be an API call to get users within a range (e.g. user id 20 to user id 30) instead of getting all the users and keeping them in main memory.  
  

**_Sorting_**  
The list can be sorted by different parameters in different orders. I probably would have put the sorting arrows on the column headers, however, I wanted to keep the table UI the same as provided in the design. The fetched data is already sorted in "recent to old" order.  
  

**_Copy to clipboard_**  
The tokens can be copied to clipboard with a click as mentioned in the specifications for this strech goal.  
  

**_Debouncing_**  
Debouncing for API calls to get filtered user list is implemented. The latency is 500 ms before the API call is made.  
  

**_Resizable columns_**  
Columns can be resized by dragging the divider between two columns. The divider is not visible unless it's hovered on (to keep the table UI the same as provided in the design). This feature is not perfect and I had to go back to vanilla JavaScript to manipulate the DOM a bit to implement this feature.  
  

**_Clickable User Names_**  
The names of users are clickable although it's not obvious from the UI (didn't add special link styling in order to to keep the table UI the same as provided in the design). Clicking a user's name will take you to their profile page.  
  

**_Editable profile page_**  
The profile page is very simple that reiterates the info shown in the table. However, you can edit some of the fields in the profile page. You save the changes momentarily by clicking the "Save" button, but, the saved info is volatile and will be discarded if the page is reloaded. This is because the changes should actually be permanently saved in the database which was not possible since no post request API reference was provided. While editing, the input fields will visually show if the input is a valid input (and also show guidelines on the format of a valid input). For the phone number input, I am assuming that country code is automatically +1 since all users have a SSN (an identification used in the US).  

I am uniquely identifying a user by the name and (not or) date of registration. This is because I assumed that the token is confidential. Ideally, I would use a non-confidential id that uniquely identifies an user.  
