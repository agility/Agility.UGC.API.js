import Agility from "agility";

var AgilityUGCAPI = new (function () {
  var API = this;

  //ENUMS
  API.DataType = {
    String: 0,
    TextBlob: 1,
    Int: 2,
    Double: 3,
    DateTime: 4,
    File: 5,
    GUID: 6,
    Encrypted: 7,
    Hashed: 8,
    Boolean: 9,
    Dropdown: 10,
    HTML: 11,
    Email: 12,
    Custom: 13,
  };

  API.RecordState = {
    New: 0,
    Published: 1,
    Deleted: 2,
    Processing: 3,
    Declined: 4,
    Error: 5,
    Escalated: 6,
    AwaitingReview: 7,
    Draft: 8,
    All: -1,
  };

  API.Permission = {
    Read: 0,
    Create: 1,
    Edit: 2,
    Delete: 3,
    Moderate: 4,
    Administer: 5,
  };

  API.FileStorage = {
    RelativeURL: 0,
    BaseURL: 1,
    EdgeURL: 2,
  };

  API.SortDirection = {
    ASC: "ASC",
    DESC: "DESC",
  };

  API.ResponseType = {
    OK: 0,
    Error: 1,
  };

  API.FileService = {
    AmazonS3: 0,
    YouTube: 1,
    Flickr: 2,
    Image: 3,
    Video: 4,
    Ooyala: 5,
    Brightcove: 6,
  };

  API.FileServiceState = {
    New: 0,
    Unprocessed: 1,
    Processed: 2,
    Error: 3,
  };

  API.RecordFlag = {
    Spam: "Spam",
    Flagged: "Flagged",
    Illegal: "Illegal",
    Abuse: "Abuse",
  };

  API.AggregateTypes = {
    Count: 0,
    Sum: 1,
    Average: 2,
  };

  API.FeedbackContentType = {
    WCM: 0,
    UGC: 1,
    Custom: 2,
  };

  API.FeedbackSubmissionType = {
    Like: 0,
    Rating: 1,
    Vote: 2,
    ApproveDisapprove: 3,
    Custom: 4,
  };

  API.SubmissionInterval = {
    None: -1,
    Day: 0,
    Hour: 1,
    Week: 2,
    Month: 3,
    Minute: 4,
    SingleSubmissionOnly: 5,
  };

  API.FileServiceMetaDataTypeName =
    "JSONPFileServiceMetaData:#Agility.UGC.API.ServiceObjects";

  API.YouTubeMetaField = {
    OriginalFilePath: "OriginalFilePath",
    VideoID: "VideoID",
    Description: "Description",
    Category: "Category",
    Title: "Title",
    Keywords: "Keywords",
    Private: "Private",
    YouTubeState: "YouTubeState",
    Duration: "Duration",
  };

  //from here: http://www.flickr.com/services/api/upload.api.html

  API.FlickrMetaField = {
    OriginalFilePath: "OriginalFilePath",
    title: "title",
    description: "description",
    tags: "tags",
    is_public: "is_public",
    is_friend: "is_friend",
    is_family: "is_family",
    safety_level: "safety_level",
    hidden: "hidden",
    photo_id: "photo_id",

    //other values are also appended as they are made available
    /*
		secret
		photopage
		SquareImageUrl
		ThumbnailImageUrl
		SmallImageUrl
		MediumImageUrl
		LargeImageUrl
		*/
  };

  API.OoyalaMetaField = {
    embedCode: "embedCode",
    title: "title",
    description: "description",
    status: "status",

    //http://www.ooyala.com/support/docs/backlot_api#query
    //other metadata (plus any "generic" metadata) values are also appended as they are made available
    /*
		thumbnailUrl
		hostedAt
		content_type
		uploadedAt
		length
		size
		updatedAt
		width
		height
		*/
  };

  API.SearchArg = function () {
    var self = this;
    ///	<summary>
    ///	The search object for the SearchRecords method.
    ///	</summary>
    ///<field name="PageSize" type="Number">The number of records per page.</field>
    ///<field name="RecordOffset" type="Number"></field>
    ///<field name="IncludeSpam" type="Boolean"></field>
    ///<field name="IncludeFlagged" type="Boolean"></field>
    ///<field name="IncludeIllegal" type="Boolean"></field>
    ///<field name="State" type="API.RecordState"></field>
    ///<field name="SortedField" type="String"></field>
    ///<field name="SortDirection" type="String"></field>
    ///<field name="RecordTypeName" type="String"></field>
    ///<field name="Search" type="String">The search string.</field>
    ///<field name="CacheKey" type="String">A custom cache key that will be used instead of the record type id to cache the results with.</field>
    ///<field name="Columns" type="Array">A list of the field names that you want to be returned.</field>

    self.PageSize = 20;
    self.RecordOffset = 0;
    self.IncludeSpam = false;
    self.IncludeFlagged = false;
    self.IncludeIllegal = false;
    self.State = API.RecordState.Published;
    self.SortedField = "";
    self.SortDirection = "";
    self.RecordTypeName = null;
    self.Search = "";
    self.CacheKey = null;
    self.Columns = [];
    self.FileStorage = API.FileStorage.RelativeURL;
    self.IncludeStatistics = false;
    self.OtherStates = null;

    this.toString = function () {
      return (
        self.PageSize +
        "." +
        self.RecordOffset +
        "." +
        self.IncludeSpam +
        "." +
        self.IncludeFlagged +
        "." +
        self.IncludeIllegal +
        "." +
        self.State +
        "." +
        self.SortedField +
        "." +
        self.SortDirection +
        "." +
        self.RecordTypeName +
        "." +
        self.Search +
        "." +
        self.CacheKey +
        "." +
        self.Columns +
        "." +
        self.FileStorage +
        "." +
        self.IncludeStatistics +
        "." +
        self.OtherStates
      );
    };
  };

  API.CommentSearchArg = function () {
    ///	<summary>
    ///	The search object for the SearchComments method.
    ///	</summary>
    ///<field name="RelatedContentID" Type="Number">The ID of the Related Content Item</field>
    ///<field name="PageSize" Type="Number">The number of records per page.</field>
    ///<field name="RecordOffset" Type="Number"></field>
    ///<field name="SortedField" Type="String"></field>
    ///<field name="SortDirection" Type="String"></field>
    ///<field name="RecordTypeName" Type="String"></field>
    ///<field name="CacheKey" Type="String">A custom cache key that will be used instead of the record type id to cache the results with.</field>
    ///<field name="OtherStates" Type="Array"></field>
    ///<field name="State" Type="API.RecordState"></field>
    ///<field name="FileStorage" Type="API.FileStorage"></field>
    ///<field name="Columns" Type="Array">A list of the field names that you want to be returned.</field>

    RelatedContentID: -1;
    PageSize: 20;
    RecordOffset: 0;
    SortedField: "CreatedOn";
    SortDirection: "DESC";
    RecordTypeName: "";
    CacheKey = null;
    OtherStates = [];
    State = API.RecordState.Published;
    FileStorage = API.FileStorage.RelativeURL;
    Columns = [];
    IgnoreAbuse = true;
    IncludeFlagged = false;
    IncludeIllegal = false;
  };

  API.FeedbackSearchArg = function () {
    ///	<summary>
    ///	The search object for the GetFeedbackAggregate method.
    ///	</summary>
    ///<field name="ReferenceName" Type="String">The Reference name of the list the feedback refers to</field>
    ///<field name="FeedbackContentType" Type="FeedbackContentType">The content type the reference name refers to (WCM/UGC/Custom)</field>
    ///<field name="FeedbackSubmissionType" Type="FeedbackSubmissionType">The submission type the reference name refers to (Like/Vote/Rating/ApproveDisaprove/Custom)</field>
    ///<field name="RelatedContentID" Type="int">The ID the item is related to</field>
    ///<field name="StartDate" Type="Date"></field>
    ///<field name="EndDate" Type="Date"></field>
    ///<field name="IsPositive" Type="Boolean"></field>
    ///<field name="Action" Type="AggregateTypes">The action to perform (Count/Sum/Average)</field>

    ReferenceName = null;
    ContentType = -1;
    SubmissionType = -1;
    RelatedContentIDs = new Array();
    StartDate = null;
    EndDate = null;
    IsPositive = null;
    Action = null;
  };

  API.BooleanFeedback = function () {
    BooleanFeedbackID = -1;
    FeedbackTypeID = -1;
    RelatedContentID = -1;
    ProfileRecordID = -1;
    ExternalProfileID = null;
    CreatedOn = null;
    IsPositive = null;

    ReferenceName = null;
    ContentType = -1;
    SubmissionType = -1;

    //Submission Rules
    RequiresAuthentication = false;
    SubmissionIntervalUnit = API.SubmissionInterval.None;
    SubmissionIntervalValue = 1;
  };

  API.RatingFeedback = function () {
    RatingFeedbackID = -1;
    FeedbackTypeID = -1;
    RelatedContentID = -1;
    ProfileRecordID = -1;
    ExternalProfileID = null;
    CreatedOn = null;
    IsPositive = null;
    RatingValue = 0;

    ReferenceName = null;
    ContentType = -1;
    SubmissionType = -1;

    //Submission Rules
    RequiresAuthentication = false;
    SubmissionIntervalUnit = API.SubmissionInterval.None;
    SubmissionIntervalValue = 1;
  };

  API.Record = function () {
    var ID = -1;
    var RecordTypeName;
    var CreatedOn;
    var ModifiedOn;
  };

  API.StatInsertArg = function () {
    /// <summary>The stat object to insert into the system.</summary>
    /// <field name="itemType" type="String">The type of item (WCM, UGC).</field>
    /// <field name="statTypeName" type="String">The type of item being tracked, eg: Article Views.</field>
    /// <field name="itemTypeName" type="String">The name item being tracked, eg: Article: My Article.</field>
    /// <field name="languageCode" type="String">The language of the item being tracked. eg: en-us.</field>
    /// <field name="itemID" type="Number">The ID of the item.</field>
    /// <field name="statCount" type="Number">The number to associate with this state.  Eg: 1, to indicate 1 view.</field>

    var self = this;
    self.itemType = "WCM";
    self.statTypeName = null;
    self.itemTypeName = null;
    self.languageCode = null;
    self.itemID = 0;
    self.statCount = 0;
  };

  API.StatSearchArg = function () {
    /// <summary>The search arg object to use to search for stats in the system.  Most arguments are nullable.</summary>
    /// <field name="itemType" type="String">The type of item (WCM, UGC).</field>
    /// <field name="statTypeName" type="String">The type of item being tracked, eg: Article Views.</field>
    /// <field name="itemTypeName" type="String">The name item being tracked, eg: Article: My Article.</field>
    /// <field name="languageCode" type="String">The language of the item being tracked. eg: en-us.</field>
    /// <field name="itemID" type="String">The ID of the item to search for. Can be null.</field>
    /// <field name="startDate" type="Date">The date to start search from, in string format.</field>
    /// <field name="endDate" type="Date">The date to start search from, in string format.</field>

    var self = this;
    self.itemType = "WCM";
    self.statTypeName = null;
    self.itemTypeName = null;
    self.languageCode = null;
    self.itemID = null;
    self.startDate = null;
    self.endDate = null;
  };

  API.Initialized = false;

  API.APIUrl = "";

  API.OnInit = function (
    API_Url,
    API_AccessKey,
    API_Seconds,
    API_RandomNumber,
    API_ProfileRecordID,
    API_Hash
  ) {
    /// <summary>
    /// Initialize the Agility DataService API
    /// </summary>
    /// <param name="API_Url" type="String">The URL to the Agility DataService REST API.</param>
    /// <param name="API_AccessKey" type="String">The API Key.</param>
    /// <param name="API_Seconds" type="String">The # of Seconds.</param>
    /// <param name="API_RandomNumber" type="String">A Random number.</param>
    /// <param name="API_ProfileRecordID" type="String">The current user ID.</param>
    /// <param name="API_Hash" type="String">The API Hash.</param>

    if (API_Url != undefined && API_Url != null) {
      API.APIUrl = API_Url;
    }
    API.APIAccessKey = API_AccessKey;
    API.APISeconds = API_Seconds;
    API.APIRandomNumber = API_RandomNumber;
    API.APIProfileRecordID = API_ProfileRecordID;
    API.APIHash = API_Hash;
    API.Initialized = true;
  };

  function checkApiIntialized(callback) {
    //check if we have a global object with these values already...
    if (window._AgilityUGCSettings) {
      API.APIAccessKey = window._AgilityUGCSettings.AccessKey;
      API.APISeconds = window._AgilityUGCSettings.Seconds;
      API.APIRandomNumber = window._AgilityUGCSettings.RandomNumber;
      API.APIProfileRecordID = window._AgilityUGCSettings.ProfileRecordID;
      API.APIHash = window._AgilityUGCSettings.AccessHash;
      API.APIUrl = window._AgilityUGCSettings.Url;
      API.Initialized = true;
    }

    if (
      API.APIUrl == null ||
      API.APIUrl == "" ||
      API.APIAccessKey == undefined
    ) {
      callback({
        ResponseType: API.ResponseType.Error,
        Message:
          "The Agility UGC API has not been initialized. Inititialize the API by calling OnInit or add a global variable named window._AgilityUGCSettings with AccessHash, AccessKey, ProfileRecordID, RandumNumber, Seconds, and Url.",
        ResponseData: null,
      });

      return false;
    }

    return true;
  }

  API.GetAllRecordTypes = function (callback) {
    /// <summary>
    /// Get All Record Types.
    /// </summary>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost("GetAllRecordTypes", null, callback);
  };

  API.GetRecordType = function (recordTypeID, callback) {
    /// <summary>
    /// Get a record based on the record type id.
    /// </summary>
    /// <param name="recordTypeID">The ID of the record type to return.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>
    if (!checkApiIntialized(callback)) return;
    return _performPost(
      "GetRecordType",
      { recordTypeID: recordTypeID },
      callback
    );
  };

  API.GetRecordTypeByName = function (recordTypeName, callback) {
    /// <summary>
    /// Get a record based on the record type name.
    /// </summary>
    /// <param name="recordTypeName">The name of the record type to return.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>
    if (!checkApiIntialized(callback)) return;

    return _performPost(
      "GetRecordTypeByName",
      { recordTypeName: recordTypeName },
      callback
    );
  };

  API.SaveRecordType = function (recordType, callback) {
    /// <summary>
    /// Saves a record type.
    /// </summary>
    /// <param name="recordType">The record type to save.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;
    var postData = JSON.stringify(recordType);

    return _performPost("SaveRecordType", { postData: postData }, callback);
  };

  API.DeleteRecordType = function (recordTypeID, callback) {
    /// <summary>
    /// Get All Record Types.
    /// </summary>
    /// <param name="recordTypeID">The ID of the record type to return.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost(
      "DeleteRecordType",
      { recordTypeID: recordTypeID },
      callback
    );
  };

  API.GetRecord = function (recordID, fileStorage, callback) {
    /// <summary>
    /// Gets a Record.
    /// </summary>
    /// <param name="recordID" type="Number">The ID of the record to return.</param>
    /// <param name="RelativeURL" type="Agility.UGC.API.FileStorage">(optional) The method to be used for building file field URLs that may be on this document.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (_isFunction(fileStorage)) {
      callback = fileStorage;
      fileStorage = null;
    }

    if (!checkApiIntialized(callback)) return;

    var postData = {
      recordID: recordID,
      fileStorage: fileStorage,
      sanitize: true,
    };

    return _performPost("GetRecord", postData, callback);
  };

  API.GetRecordHistory = function (recordID, callback) {
    /// <summary>
    /// Gets a the Version Histor for a Record.  This method requires admin access.
    /// </summary>
    /// <param name="recordID">The ID of the record to return.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost("GetRecordHistory", { recordID: recordID }, callback);
  };

  API.DeleteRecord = function (recordID, callback) {
    /// <summary>
    /// Deletes a Record.
    /// </summary>
    /// <param name="recordID">The ID of the record to return.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost("DeleteRecord", { recordID: recordID }, callback);
  };

  API.SetRecordFlag = function (recordID, flag, reason, callback) {
    /// <summary>
    /// Sets whether a record is flagged or not.
    /// </summary>
    /// <param name="recordID" type="Number">The ID of the record to return.</param>
    /// <param name="flag" type="Agility.UGC.API.RecordFlag">Whether the record is flagged or not.</param>
    /// <param name="reason" type="String">Whether the record is flagged or not.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost(
      "SetRecordFlag",
      { recordID: recordID, flagStr: flag, reason: reason },
      callback
    );
  };

  API.InsertRecordHistory = function (recordID, comment, callback) {
    /// <summary>
    /// Adds a comment to the record history.
    /// </summary>
    /// <param name="recordID">The ID of the record to return.</param>
    /// <param name="comment">The comment.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost(
      "InsertRecordHistory",
      { recordID: recordID, comment: comment },
      callback
    );
  };

  API.SetRecordState = function (
    recordID,
    recordState,
    reason,
    comment,
    callback
  ) {
    /// <summary>
    /// Sets a record state.  Used for publish/decline, etc.
    /// </summary>
    /// <param name="recordID">The ID of the record to return.</param>
    /// <param name="recordState">The State of the record (from enum)</param>
    /// <param name="reason">The reason that the record is in this state.  May be null if not an Error state.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>
    /// <param name="comment">The comment to send to the user with any notification, if any.</param>

    if (_isFunction(comment)) {
      callback = comment;
      comment = "";
    }

    if (!checkApiIntialized(callback)) return;

    //note - this method has been changed to a POST so that the reason can be as long as needed.
    if (reason == undefined || reason == null) reason = "";
    if (comment == undefined || comment == null) comment = "";

    var postData = {
      recordID: recordID,
      recordState: recordState,
      reason: reason,
      comment: comment,
    };

    return _performPost("SetRecordState", postData, callback);
  };

  API.SetRecordFileState = function (
    recordID,
    fieldName,
    fileServiceState,
    callback
  ) {
    /// <summary>
    /// Sets the file service state on a given file service field.
    /// </summary>
    /// <param name="recordID">The ID of the record to return.</param>
    /// <param name="fieldName">The name of the field the file is associated with on the record.</param>
    /// <param name="fileServiceState">The fileServiceState to set the field to.  Normally this will be FileServiceState.Unprocessed.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;
    var postData = {
      recordID: recordID,
      fieldName: fieldName,
      fileServiceState: fileServiceState,
    };

    return _performPost("SetRecordFileState", postData, callback);
  };

  API.UpdateRecordTypeAlert = function (
    recordTypeID,
    recordState,
    moderatorID,
    otherNotificationType,
    callback
  ) {
    /// <summary>
    /// Inserts or updates a RecordTypeAlert.
    /// </summary>
    /// <param name="recordTypeID"></param>
    /// <param name="recordState"></param>
    /// <param name="moderatorID"></param>
    /// <param name="otherNotificationType"></param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    if (callback == undefined && _isFunction(otherNotificationType)) {
      callback = otherNotificationType;
      otherNotificationType = null;
    }

    var postData = {
      recordTypeID: recordTypeID,
      recordStateID: recordState,
      moderatorID: moderatorID,
      otherNotificationType: otherNotificationType,
    };

    return _performPost("UpdateRecordTypeAlert", postData, callback);
  };

  API.DeleteRecordTypeAlert = function (
    recordTypeID,
    recordState,
    moderatorID,
    otherNotificationType,
    callback
  ) {
    /// <summary>
    /// Deletes a RecordTypeAlert.
    /// </summary>
    /// <param name="recordTypeID"></param>
    /// <param name="recordState"></param>
    /// <param name="moderatorID"></param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    if (callback == undefined && _isFunction(otherNotificationType)) {
      callback = otherNotificationType;
      otherNotificationType = null;
    }

    var postData = {
      recordTypeID: recordTypeID,
      recordStateID: recordState,
      moderatorID: moderatorID,
      otherNotificationType: otherNotificationType,
    };

    return _performPost("DeleteRecordTypeAlert", postData, callback);
  };

  API.GetRecordTypeAlerts = function (recordTypeID, callback) {
    /// <summary>
    /// Gets the RecordTypeAlerts from a specific recordTypeID
    /// </summary>
    /// <param name="recordTypeID"></param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost(
      "GetRecordTypeAlerts",
      { recordTypeID: recordTypeID },
      callback
    );
  };

  API.InsertStat = function (statArg, callback) {
    /// <summary>
    /// Inserts an analytics stat into the system.
    /// </summary>
    /// <param name="statArg" type="API.StatInsertArg">The stat to insert.</param>

    if (!checkApiIntialized(callback)) return;

    var postData = {
      itemType: statArg.itemType,
      statTypeName: statArg.statTypeName,
      itemTypeName: statArg.itemTypeName,
      languageCode: statArg.languageCode,
      itemID: statArg.itemID,
      statCount: statArg.statCount,
    };

    return _performPost("InsertStat", postData, callback);
  };

  API.GetStats = function (statSearchArg, callback) {
    /// <summary>
    /// Gets a set of analytics stats from the system.
    /// </summary>
    /// <param name="statSearchArg" type="API.StatSearchArg">The stat criteria to search for.</param>

    if (!checkApiIntialized(callback)) return;

    var startDateStr = null;
    var endDateStr = null;
    if (statSearchArg.startDate) {
      startDateStr = statSearchArg.startDate.toString("yyyy-MM-dd");
    }

    if (statSearchArg.endDate) {
      endDateStr = statSearchArg.endDate.toString("yyyy-MM-dd");
    }

    var postData = {
      itemType: statSearchArg.itemType,
      statTypeName: statSearchArg.statTypeName,
      itemTypeName: statSearchArg.itemTypeName,
      languageCode: statSearchArg.languageCode,
      itemID: statSearchArg.itemID,
      startDate: startDateStr,
      endDate: endDateStr,
    };

    return _performPost("GetStats", postData, callback);
  };

  API.ClearCache = function (cacheKey, callback) {
    /// <summary>
    /// Clears the cache for a given cache key that was previously passed into the SearchRecords call in the SearchArg parameter.
    /// </summary>
    /// <param name="cacheKey">A cache key that was previously passed into the SearchRecords call in the SearchArg parameter.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost("ClearCache", { cacheKey: cacheKey }, callback);
  };

  API.SaveRecord = function (record, callback, cacheKey, recordType) {
    /// <summary>
    /// Saves a record.
    /// </summary>
    /// <param name="record">The record to save.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message, ValidationErrors}.</param>
    /// <param name="cacheKey">Optional - the cacheKey to clear the cache for.  Use this in conjunction with the same cacheKey on calls to SearchRecords to control the cache.</param>

    if (!checkApiIntialized(callback)) return;

    if (record == null)
      callback(API.ResponseType.Error, "The record object cannot be null.");
    if (
      record.RecordTypeName == undefined ||
      record.RecordTypeName == null ||
      record.RecordTypeName == ""
    ) {
      callback({
        ResponseType: API.ResponseType.Error,
        Message: "The RecordTypeName property cannot be null.",
      });
      return null;
    }

    var performSave = function () {
      //check the record type
      if (recordType == undefined || recordType == null) {
        callback({
          ResponseType: API.ResponseType.Error,
          Message:
            "The Record Type " + record.RecordTypeName + " could not be found.",
        });
        return null;
      }

      //validate the field types...
      var lstFieldErrors = [];
      for (var i = 0; i < recordType.FieldTypes.length; i++) {
        var fieldType = recordType.FieldTypes[i];
        var fieldValue = record[fieldType.Name];

        if (fieldValue != undefined && fieldValue != null) {
          //check for a file value..
          if (fieldValue.OriginalFilePath != undefined)
            fieldValue = fieldValue.OriginalFilePath;
        }

        var fieldLabel = recordType.FieldTypes[i].Label;

        if (fieldType.AllowNull == false) {
          //req field
          if (
            fieldValue == undefined ||
            fieldValue == null ||
            new String(fieldValue).length == 0
          ) {
            lstFieldErrors[lstFieldErrors.length] = {
              FieldType: fieldType,
              Message: "The " + fieldType.Label + " field is required.",
            };
          }
        }

        if (fieldValue == undefined || fieldValue == null || fieldValue == "") {
          //skip null vals if they are allowed...
          continue;
        }

        switch (fieldType.DataType) {
          case API.DataType.Boolean:
            if (
              new String(fieldValue).toLowerCase() != "true" &&
              new String(fieldValue).toLowerCase() != "false"
            ) {
              lstFieldErrors[lstFieldErrors.length] = {
                FieldType: fieldType,
                Message:
                  "Could not convert value " +
                  fieldValue +
                  " from field " +
                  fieldType.Label +
                  " to a boolean.",
              };
            }
            break;
          case API.DataType.DateTime:
            var m = moment(fieldValue, "YYYY-MM-DD hh:mm a");
            var dt = null;
            if (m.isValid()) dt = m.toDate();
            //var dt = new Date(fieldValue);
            if (dt == null) {
              lstFieldErrors[lstFieldErrors.length] = {
                FieldType: fieldType,
                Message:
                  "Could not convert value " +
                  fieldValue +
                  " from field " +
                  fieldType.Label +
                  " to a date/time.",
              };
            }
            break;
          case API.DataType.Double:
            if (isNaN(parseFloat(fieldValue))) {
              lstFieldErrors[lstFieldErrors.length] = {
                FieldType: fieldType,
                Message:
                  "Could not convert value " +
                  fieldValue +
                  " from field " +
                  fieldType.Label +
                  " to a number.",
              };
            }
            break;
          case API.DataType.Int:
            if (isNaN(parseInt(fieldValue))) {
              lstFieldErrors[lstFieldErrors.length] = {
                FieldType: fieldType,
                Message:
                  "Could not convert value " +
                  fieldValue +
                  " from field " +
                  fieldType.Label +
                  " to a number.",
              };
            }
            break;
          case API.DataType.String:
            //enforce max length...
            if (fieldType.MaxLength == 0 && fieldValue.Length > 400) {
              lstFieldErrors[lstFieldErrors.length] = {
                FieldType: fieldType,
                Message:
                  "The value from field " +
                  fieldType.Label +
                  " must be 400 characters or less.",
              };
            } else if (
              fieldType.MaxLength > 0 &&
              fieldValue.Length > fieldType.MaxLength
            ) {
              lstFieldErrors[lstFieldErrors.length] = {
                FieldType: fieldType,
                Message:
                  "The value from field " +
                  fieldType.Label +
                  " must be " +
                  fieldType.MaxLength +
                  " characters or less.",
              };
            }

            var o1 = _enforceRegex(fieldType, fieldValue, fieldLabel);
            if (o1 != null) {
              lstFieldErrors[lstFieldErrors.length] = o1;
            }

            break;

          default:
            //textblob - enforce max length

            if (
              fieldType.MaxLength > 0 &&
              fieldValue.Length > fieldType.MaxLength
            ) {
              lstFieldErrors[lstFieldErrors.length] = {
                FieldType: fieldType,
                Message:
                  "The value from field " +
                  fieldType.Label +
                  " must be " +
                  fieldType.MaxLength +
                  " characters or less.",
              };
            }

            var o2 = _enforceRegex(fieldType, fieldValue, fieldLabel);
            if (o2 != null) {
              lstFieldErrors[lstFieldErrors.length] = o2;
            }
            break;
        }
      }

      //check for validation errors
      if (lstFieldErrors.length > 0) {
        var msg = "";
        for (var x = 0; x < lstFieldErrors.length; x++) {
          msg += " - " + lstFieldErrors[x].Message + "\n";
        }

        callback({
          ResponseType: API.ResponseType.Error,
          Message: msg,
          ValidationErrors: lstFieldErrors,
        });
        return;
      }

      //do the deed
      var postData = JSON.stringify(record);
      if (cacheKey == undefined || cacheKey == null) cacheKey = "";

      return _performPost(
        "SaveRecord",
        { cacheKey: cacheKey, postData: postData },
        callback
      );
    };

    if (recordType) {
      return performSave();
    }

    //get the record type
    API.GetRecordTypeByName(record.RecordTypeName, function (response) {
      if (response.ResponseType == API.ResponseType.Error) {
        callback(response);
        return;
      } else {
        recordType = response.ResponseData;
        return performSave();
      }
    });
  };

  function _enforceRegex(fieldType, fieldValue, fieldLabel) {
    if (
      fieldValue == undefined ||
      fieldValue == null ||
      fieldValue == "" ||
      typeof fieldValue != "string"
    )
      return null;

    //enfore regex
    if (
      fieldType.ValidationRegEx != null &&
      fieldType.ValidationRegEx != "" &&
      fieldType.ValidationRegEx !=
        "Add comma separated file extensions. Eg: .pdf, .gif"
    ) {
      try {
        var rEx = new RegExp(fieldType.ValidationRegEx);
        rEx.ignoreCase = true;

        if (fieldValue.search(rEx) == -1) {
          if (
            fieldType.ValidationMessage != null &&
            fieldType.ValidationMessage != "" &&
            fieldType.ValidationMessage !=
              "Add the file type validation message."
          ) {
            return {
              FieldType: fieldType,
              Message: fieldType.ValidationMessage,
            };
          } else {
            return {
              FieldType: fieldType,
              Message:
                "The value from field " +
                fieldType.Label +
                " did not match the validation expression requirements.",
            };
          }
        }
      } catch (Error) {
        //ignore regex errors...
      }
    }
  }

  function _isFunction(functionToCheck) {
    return (
      functionToCheck &&
      {}.toString.call(functionToCheck) === "[object Function]"
    );
  }

  function _logError(message) {
    if (console) {
      console.log(message);
    }
  }

  API.SearchRecords = function (searchArg, callback) {
    /// <summary>
    /// Searches for records based on a SearchArg object.
    /// </summary>
    /// <param name="searchArg" type="Agility.UGC.API.SearchArg">The search arg object.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    var argStr = JSON.stringify(searchArg);
    return _performPost(
      "SearchRecords",
      { search: argStr, sanitize: true },
      callback
    );
  };

  API.SearchComments = function (commentSearchArg, callback) {
    /// <summary>
    /// Searches for records based on a SearchArg object.
    /// </summary>
    /// <param name="commentSearchArg" type="Agility.UGC.API.CommentSearchArg">The search arg object.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    var argStr = JSON.stringify(commentSearchArg);

    return _performPost(
      "SearchComments",
      { search: argStr, sanitize: true },
      callback
    );
  };

  API.SearchCommentParentIDs = function (commentSearchArg, callback) {
    /// <summary>
    /// Searches for parent record ids for comments based on a SearchArg object.
    /// </summary>
    /// <param name="commentSearchArg" type="Agility.UGC.API.CommentSearchArg">The search arg object.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    var argStr = JSON.stringify(commentSearchArg);
    return _performPost("SearchCommentParentIDs", { search: argStr }, callback);
  };

  API.GetFeedbackAggregate = function (searchArg, callback) {
    /// <summary>
    /// Searches for records based on a SearchArg object.
    /// </summary>
    /// <param name="searchArg" type="Agility.UGC.API.SearchArg">The search arg object.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    var argStr = JSON.stringify(searchArg);
    return _performPost(
      "GetFeedbackAggregate",
      { feedbackSearchArg: argStr },
      callback
    );
  };

  API.SaveRating = function (ratingFeedback, callback) {
    var rating = ratingFeedback;
    rating.SubmissionType = API.FeedbackSubmissionType.Rating;
    API.SaveRatingFeedback(rating, callback);
  };

  API.SaveLike = function (booleanFeedback, callback) {
    var like = booleanFeedback;
    like.SubmissionType = API.FeedbackSubmissionType.Like;
    like.IsPositive = true;

    API.SaveBooleanFeedback(like, callback);
  };

  API.SaveVote = function (booleanFeedback, callback) {
    var vote = booleanFeedback;
    vote.IsPositive = true;
    vote.SubmissionType = API.FeedbackSubmissionType.Vote;

    API.SaveBooleanFeedback(vote, callback);
  };

  API.SaveApproveDisapprove = function (booleanFeedback, IsApproved, callback) {
    var ap = booleanFeedback;
    ap.IsPositive = IsApproved;
    ap.SubmissionType = API.FeedbackSubmissionType.ApproveDisapprove;

    API.SaveBooleanFeedback(ap, callback);
  };

  API.SaveRatingFeedback = function (ratingFeedback, callback) {
    /// <summary>
    /// Saves a Rating Feedback Object
    /// </summary>
    /// <param name="ratingFeedback">The rating feedback to save.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    if (API.APIProfileRecordID > 0) {
      ratingFeedback.ProfileRecordID = API.APIProfileRecordID;
    }

    var postData = JSON.stringify(ratingFeedback);

    return _performPost("SaveRatingFeedback", { postData: postData }, callback);
  };

  API.SaveBooleanFeedback = function (booleanFeedback, callback) {
    /// <summary>
    /// Saves a boolean feedback object
    /// </summary>
    /// <param name="booleanFeedback">The boolean feedback to save.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    if (API.APIProfileRecordID > 0) {
      booleanFeedback.ProfileRecordID = API.APIProfileRecordID;
    }

    var postData = JSON.stringify(booleanFeedback);

    return _performPost(
      "SaveBooleanFeedback",
      { postData: postData },
      callback
    );
  };

  var _settingsCache = null;

  API.GetSettings = function (callback, ignoreCache) {
    /// <summary>
    /// Get the Settings.
    /// </summary>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>
    /// <param name="ignoreCache" type="Boolean">Whether to ignore the cached value and get the settings from the server every time.<param>

    if (!checkApiIntialized(callback)) return;

    if (_settingsCache == null || ignoreCache == true) {
      return _performPost("GetSettings", null, function (data) {
        if (data.ResponseType != API.ResponseType.OK) {
          callback(data);
        } else {
          _settingsCache = data.ResponseData;
          callback(data);
        }
      });
    } else {
      //use the cached value...
      callback({
        ResponseType: API.ResponseType.OK,
        ResponseData: _settingsCache,
      });
      return null;
    }
  };

  API.SaveSettings = function (settings, callback) {
    /// <summary>
    /// Saves the Settings
    /// </summary>
    /// <param name="settings">The settings to save.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    _settingsCache = null;

    var postData = JSON.stringify(settings);

    return _performPost("SaveSettings", { postData: postData }, callback);
  };

  API.GetAllSyndicationServices = function (callback) {
    /// <summary>
    /// Gets all of the syndication services that have been configured.
    /// </summary>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost("GetAllSyndicationServices", null, callback);
  };

  API.DeleteSyndicationService = function (syndicationServiceID, callback) {
    /// <summary>
    /// Deletes a syndication service.
    /// </summary>
    /// <param name="syndicationServiceID" type="Number">The ID of the syndication service</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost(
      "DeleteSyndicationService",
      { syndicationServiceID: syndicationServiceID },
      callback
    );
  };

  API.SaveSyndicationService = function (syndicationService, callback) {
    /// <summary>
    /// Saves the Settings
    /// </summary>
    /// <param name="syndicationService">The settings to save.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    var postData = JSON.stringify(syndicationService);

    return _performPost(
      "SaveSyndicationService",
      { postData: postData },
      callback
    );
  };

  API.GetAllSystemAccess = function (callback) {
    /// <summary>
    /// Gets all of the System Access names in the system/
    /// </summary>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost("GetAllSystemAccess", null, callback);
  };

  API.GetGUID = function (callback) {
    /// <summary>
    /// Get a GUID.
    /// </summary>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost("GetGUID", null, callback);
  };

  API.GetAmazonS3Signature = function (policy, callback) {
    /// <summary>
    /// Gets a signature for an Amazon S3 call.
    /// </summary>
    /// <param name="policy" type="String"></param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost("GetAmazonS3Signature", { policy: policy }, callback);
  };

  API.GetOoyalaSignature = function (queryString, callback) {
    /// <summary>
    /// Gets a signature for an Ooyala upload.
    /// </summary>
    /// <param name="queryString" type="String"></param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost(
      "GetOoyalaSignature",
      { parameters: queryString },
      callback
    );
  };

  API.DeleteFile = function (key, callback) {
    /// <summary>
    /// Deletes a file from the Amazon S3 bucket
    /// </summary>
    /// <param name="key" type="String">The full key that points to the file in S3.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    return _performPost("DeleteFile", { key: key }, callback);
  };

  var _fileSizeCache = {};

  API.GetFileSize = function (key, callback) {
    /// <summary>
    /// Get the file size from a file in the Amazon S3 bucket.
    /// </summary>
    /// <param name="key" type="String">The full key that points to the file in S3.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;

    if (_fileSizeCache[key] == undefined) {
      _performPost("GetFileSize", { key: key }, function (data) {
        if (data.ResponseType == API.ResponseType.OK) {
          _fileSizeCache[key] = new Number(data.ResponseData);
        }
        callback(data);
      });
    } else {
      callback({
        ResponseType: API.ResponseType.OK,
        ResponseData: new Number(_fileSizeCache[key]),
      });
    }
  };

  API.TestBrightcoveAuthenticationSettings = function (
    readToken,
    writeToken,
    callback
  ) {
    _logError("Brightcove support has been removed from UGC.");
  };

  API.TestYouTubeAuthenticationSettings = function (
    applicationName,
    apiKey,
    username,
    password,
    callback
  ) {
    _logError("YouTube support has been removed from UGC.");
  };

  API.TestAmazonS3AuthenticationSettings = function (
    bucket,
    apiKey,
    secretKey,
    callback
  ) {
    _logError("Amazon S3 support has been removed from UGC.");
  };

  API.GenerateTwitterOauthRequestToken = function (key, secret, callback) {
    _logError("Twitter support has been removed from UGC.");
  };

  API.GetAmazonS3Form = function (options) {
    /// <summary>
    /// Builds the SWF form uploader that will upload data to Amazon S3.  The HTML will be appended to the jQuery element that is passed into the options argument (options.fieldPanel)
    /// </summary>
    /// <param name="options">The options for this input. Has the following properties: fieldName, inputID, fieldType  fieldPanel, swfUploadUrl, beforeUpload, uploadComplete, uploadError, uploadProgress, uploadButtonImageUrl, uploadButtonImageHeight, uploadButtonImageWidth, </param>

    _logError(
      "The GetAmazonS3Form method has been deprecated and removed from this and future versions of the UGC sdk."
    );
    return;
  };

  function validateFileType(filepath, validExp) {
    if (validExp == null || validExp == "") return true;

    validExp = validExp.replace(".*([\\", "");
    validExp = validExp.replace("])", "");

    while (validExp.indexOf("]|[\\") != -1) {
      validExp = validExp.replace("]|[\\", ";");
    }
    fileTypes = validExp.replace(/\./g, "*.");

    var ary = fileTypes.split(";");

    var selectedExt = filepath
      .substring(filepath.lastIndexOf("."))
      .toLowerCase();
    if (selectedExt.indexOf(".") != -1) {
      selectedExt = selectedExt
        .substring(selectedExt.lastIndexOf("."))
        .toLowerCase();
    }

    for (var i in ary) {
      var ext = ary[i].trim();
      if (ext == "" || ext.length < 2 || ext.indexOf("*") != 0) continue;
      ext = ext.substring(1).toLowerCase();
      if (ext == selectedExt) {
        return true;
      }
    }

    return false;
  }

  API.GetUGCUploadForm = function (options) {
    /// <summary>
    /// Builds the SWF form uploader that will upload data to UGC.  The HTML will be appended to the jQuery element that is passed into the options argument (options.fieldPanel)
    /// </summary>
    /// <param name="options">The options for this input. Has the following properties: fieldName, inputID, fieldType  fieldPanel, swfUploadUrl, beforeUpload, uploadComplete, uploadError, uploadProgress, uploadButtonImageUrl, uploadButtonImageHeight, uploadButtonImageWidth, </param>

    _logError(
      "The GetAmazonS3Form method has been deprecated and removed from this and future versions of the UGC sdk."
    );
    return;
  };

  API.UploadFile = function (
    file,
    fieldType,
    callback,
    errorCallback,
    alwaysCallback,
    progressCallback
  ) {
    //validate the file...
    if (fieldType != null) {
      try {
        //file size
        if (fieldType.MaxLength > 0) {
          //convert from kb to bytes...
          var maxSizeBytes = fieldType.MaxLength * 1024;
          if (file.size > maxSizeBytes) {
            callback({
              ResponseType: API.ResponseType.Error,
              Message: "Max file size " + fieldType.MaxLength + "kb",
            });
            return;
          }
        }

        //file type
        if (!validateFileType(file.name, fieldType.ValidationRegEx)) {
          var validExp = fieldType.ValidationRegEx;
          validExp = validExp.replace(".*([\\", "").replace("])", "");
          while (validExp.indexOf("]|[\\") != -1) {
            validExp = validExp.replace("]|[\\", ";");
          }
          fileTypes = validExp.replace(/\./g, "*.");

          var msg = "Please choose a valid file type (" + fileTypes + ").";
          if (fieldType.ValidationMessage) {
            msg = fieldType.ValidationMessage + " (" + fileTypes + ")";
          }

          callback({
            ResponseType: API.ResponseType.Error,
            Message: msg,
          });
          return;
        }
      } catch (ex3) {
        return;
      }
    }

    //get the settings...
    API.GetSettings(function (data) {
      if (data.ResponseType != API.ResponseType.OK) {
        callback(data);
        return;
      } else {
        var settings = data.ResponseData;

        //if Amazon S3 is NOT enabled, just upload to UGC
        if (settings.AmazonS3Bucket == null || settings.AmazonS3Bucket == "") {
          //regular upload...
          API._uploadFileToUGC(
            file,
            settings,
            callback,
            errorCallback,
            alwaysCallback,
            progressCallback
          );
          return;
        } else {
          //UPLOAD to Amazon S3
          _logError("Uploading to S3 is no longer supported.");
        }
      }
    });
  };

  API._uploadFileToUGC = function (
    file,
    settings,
    callback,
    errorCallback,
    alwaysCallback,
    progressCallback
  ) {
    //TODO: update this to support file uploads - exactly like they are handled within the Form Builder
    _logError("This method has not been implemented yet in this version.");
  };

  API._uploadFileToAmazonS3 = function (
    file,
    settings,
    callback,
    errorCallback,
    alwaysCallback,
    progressCallback
  ) {
    _logError("The method _uploadFileToAmazonS");
  };

  //global variable used to track whether the  live attachment remove randler event has been bound
  API._liveAttachmentRemoveHandlerBound = false;

  function _performPost(methodName, postData, callback) {
    if (!postData) postData = {};

    var url = API.APIUrl;
    if (url == "" || url == null) return null;

    url = url.toLowerCase();

    url = url.replace("http://", "https://");
    url = url.replace("/agility-ugc-api-jsonp.svc", "/ugc-api");

    if (url.lastIndexOf("/") != url.length - 1) url += "/";

    //create the base url for the call
    url += methodName;

    //sanitize the post data
    if (postData.postData) {
      var postDataStr = postData.postData;

      postData.postData =
        "__SANITIZED__" +
        postDataStr
          .replace(/&/g, "&amp;")
          .replace(/'/g, "&apos;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
    }

    //add the auth stuff into the postData
    postData.accessKey = API.APIAccessKey;
    postData.seconds = API.APISeconds;
    postData.randomNumber = API.APIRandomNumber;
    postData.hash = API.APIHash;
    postData.profileRecordID = API.APIProfileRecordID;

    var sanitize = postData.sanitize;
    if (sanitize != true) sanitize = false;

    var contentType = sanitize
      ? "application/x-www-form-urlencoded"
      : "application/json";
    var contentToSend = sanitize
      ? _json_to_URLEncoded(postData)
      : JSON.stringify(postData);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", contentType + ";charset=UTF-8");
    xhr.withCredentials = true;
    xhr.onload = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          //success
          var saniKey = "__SANITIZED__";
          var result = xhr.responseText;

          if (
            sanitize &&
            result &&
            result.indexOf &&
            result.indexOf(saniKey) == 0
          ) {
            //the result has been sanitized - we need to desanitize it...

            result = result
              .substring(saniKey.length)
              .replace(/&apos;/g, "'")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&amp;/g, "&");
          }

          result = JSON.parse(result);
          callback(result);
        } else {
          var result = xhr.responseText;
          callback({
            ResponseType: API.ResponseType.Error,
            Message: errorMessage,
          });
        }
      }
    };
    xhr.send(contentToSend);
  }

  function _json_to_URLEncoded(element, key, list) {
    var list = list || [];
    if (typeof element == "object") {
      for (var idx in element)
        _json_to_URLEncoded(
          element[idx],
          key ? key + "[" + idx + "]" : idx,
          list
        );
    } else {
      list.push(key + "=" + encodeURIComponent(element));
    }
    return list.join("&");
  }

  function _buildAPIUrl(methodName, args, query) {
    var url = API.APIUrl;
    if (url == "" || url == null) return null;
    //query should be in the form "q1=q1val&s2=s2val

    url = url.toLowerCase();
    url = url.replace("http://", "https://");

    //ensure the url ends with /
    if (url.lastIndexOf("/") != url.length - 1) url += "/";

    //create the base url for the call
    url +=
      methodName +
      "/" +
      API.APIAccessKey +
      "/" +
      API.APISeconds +
      "/" +
      API.APIRandomNumber +
      "/" +
      API.APIHash +
      "/" +
      API.APIProfileRecordID;

    //add the arguments for call
    if (args != undefined && Array.isArray(args) && args.length > 0) {
      for (var i in args) {
        url += "/" + escape(arg[i]);
      }
    }

    //add the "method" param
    url += "?method=?";

    //add the query strings
    if (query != undefined && query != "") {
      url += "&" + query;
    }

    return url;
  }

  var _authCookieName = null;

  API.GetAuthCookieName = function () {
    /// <summary>Gets the name of the cookie that will be used for authentication.</summary>
    if (_authCookieName == null)
      _authCookieName = "UGC_AUTH_" + API.APIAccessKey;
    return _authCookieName;
  };

  API.SetAuthCookieName = function (cookieName) {
    /// <summary>Gets the name of the cookie that will be used for authentication.</summary>
    return (_authCookieName = cookieName);
  };

  API.Logout = function (websiteUserTypeName) {
    /// <summary>Logs a user out of the UGC system and removes their login cookie.</summary>
    /// <param name="websiteUserTypeName" type="String">The website user type reference name.</param>

    //set the cookie based on the API Access Key
    var cookieName = API.GetAuthCookieName();
    if (websiteUserTypeName != null) cookieName += websiteUserTypeName;
    var cookieDate = Date.today().addMonths(-1);
    var cookieValue = null;
    Agility.SetCookie(cookieName, cookieValue, cookieDate, "/", null, true);
  };

  API.Authenticate = function (
    websiteUserTypeName,
    login,
    password,
    persistCookie,
    loginFieldName,
    callback
  ) {
    /// <summary>Authenticates a user based on their login and password and their website user type reference name.  Returns the authentication token on success, empty string on failure.  This will also set a cookie that will keep the user logged in for this session, or persist the cookie if desired.</summary>
    /// <param name="websiteUserTypeName" type="String">The website user type reference name.</param>
    /// <param name="login" type="String">The login, usually a username or email address.</param>
    /// <param name="password" type="String">The password.</param>
    /// <param name="persistCookie" type="Boolean">(Optional) Whether or not to persist the authentication token in a cookie.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (callback == undefined) {
      if (loginFieldName != undefined && _isFunction(loginFieldName)) {
        callback = loginFieldName;
        loginFieldName = "";
      }
    }

    if (callback == undefined) {
      if (persistCookie != undefined && _isFunction(persistCookie)) {
        callback = persistCookie;
        persistCookie = false;
      }
    }

    if (loginFieldName == undefined) loginFieldName = "";

    if (!checkApiIntialized(callback)) return;

    var postData = {
      profileTypeName: websiteUserTypeName,
      login: login,
      password: password,
      loginFieldName: loginFieldName,
    };

    return _performPost("Authenticate", postData, function (data) {
      if (data != undefined) {
        var token = data.ResponseData;

        if (token != undefined && token != null && token != "") {
          //set the cookie based on the API Access Key
          var cookieName = API.GetAuthCookieName();
          if (websiteUserTypeName != null) cookieName += websiteUserTypeName;

          var cookieValue = new String(token);
          var cookieDate = null;
          if (persistCookie) {
            cookieDate = Date.today().addMonths(1);
          }
          Agility.SetCookie(
            cookieName,
            cookieValue,
            cookieDate,
            "/",
            null,
            false
          );
        }
        //return the OK response and the authentication token
        callback({
          ResponseType: API.ResponseType.OK,
          ResponseData: token,
          Message: null,
        });
      }
    });
  };

  API.IsAuthenticated = function (websiteUserTypeName, callback) {
    /// <summary>Determines if the current user is authenticated and returns the user ID if so.  If the profileRecordID returned is less than zero, the user is NOT authenticated.</summary>
    /// <param name="websiteUserTypeName" type="String">The website user type reference name to validate the current used based on.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    //grab the token the from the cookie
    var cookieName = API.GetAuthCookieName();
    if (websiteUserTypeName != null) cookieName += websiteUserTypeName;

    var token = Agility.GetCookie(cookieName);

    if (token == null || token == "") {
      callback({
        ResponseType: API.ResponseType.OK,
        ResponseData: false,
        Message: null,
      });
      return;
    }

    if (!checkApiIntialized(callback)) return;

    var postData = {
      authenticationToken: token,
      profileTypeName: websiteUserTypeName,
    };

    return _performPost("IsAuthenticated", postData, function (data) {
      if (
        data != undefined &&
        data.ResponseData != undefined &&
        data.ResponseData != null
      ) {
        var profileRecordID = data.ResponseData.ProfileRecordID;
        var seconds = data.ResponseData.Seconds;
        var randomNumber = data.ResponseData.RandomNumber;
        var hash = data.ResponseData.AccessHash;
        var accessKey = data.ResponseData.AccessKey;

        //reset the API data for this session
        API.APIAccessKey = accessKey;
        API.APISeconds = seconds;
        API.APIRandomNumber = randomNumber;
        API.APIProfileRecordID = profileRecordID;
        API.APIHash = hash;

        //send results to the user...
        callback({
          ResponseType: API.ResponseType.OK,
          ResponseData: profileRecordID,
          Message: null,
        });
      }
    });
  };

  API.ChangePassword = function (currentPassword, newPassword, callback) {
    /// <summary>Change the password for the current website user. The ResponseData parameter of the callback will be a true/false if the password change was successful.<summary>
    /// <param name="currentPassword" type="String">The user's current password.</param>
    /// <param name="newPassword" type="String">The user's new password.</param>
    /// <param name="newPassword" type="String">The user's new password.</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (API.APIProfileRecordID < 1) {
      callback({
        ResponseType: API.ResponseType.Error,
        ResponseData: false,
        Message: "The user is not currently logged in.",
      });
      return;
    }

    if (!checkApiIntialized(callback)) return;

    var postData = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    return _performPost("ChangePassword", postData, function (data) {
      callback(data);
    });
  };

  API.RetrievePassword = function (websiteUserTypeName, login, callback) {
    /// <summary>Retrieve the password for the profile login name and type. The ResponseData parameter of the callback will be a true/false if the password change was successful.<summary>
    /// <param name="websiteUserTypeName" type="String">The website user type reference name.</param>
    /// <param name="login" type="String">The user's login (usually username or email address).</param>
    /// <param name="callback" type="Function">The method to callback to.  Has 1 parameter with the following object: {ResponseType, ResponseData, Message}.</param>

    if (!checkApiIntialized(callback)) return;
    var args = new Array();
    args.push(websiteUserTypeName);

    var postData = {
      profileTypeName: websiteUserTypeName,
      login: login,
    };

    return _performPost("RetrievePassword", postData, function (data) {
      if (
        data != undefined &&
        data.ResponseData != undefined &&
        data.ResponseData != null
      ) {
        //send results to the user...
        callback({
          ResponseType: API.ResponseType.OK,
          ResponseData: data.ResponseData,
          Message: null,
        });
      }
    });
  };

  API.GetODataMetaData = function (callback) {
    _logError("OData support has been removed in UGC.");
  };

  API.GetODataFeed = function (recordTypeName, options, callback) {
    _logError("OData support has been removed in UGC.");
  };

  API.GetODataRecord = function (recordTypeName, recordID, callback) {
    _logError("OData support has been removed in UGC.");
  };

  API.ExecCustomProcedure = function (proc, paramArgs, callback) {
    _logError(
      "Executing custom store procedures in JS has been removed in UGC and no longer supported."
    );
  };

  API.GetMIMEtype = function (filename) {
    /// <summary>
    /// Gets the mime-type of a file based on a filename.
    /// </summary>
    /// <param name="filename" type="String">The file name (from a file upload...)</param>

    var fn = new String(filename);
    var fn1 = new String();
    fn1 = fn.match(/[\/\\][^\/\\]*$/);
    if (fn1 != null && fn1.length > 0) fn = fn1 + "";

    fn = fn.toLowerCase();

    if (fn.search(/^.*\.ai$/) >= 0) {
      return "application/illustrator";
    }
    if (fn.search(/^.*\.bin$/) >= 0) {
      return "application/octet-stream";
    }
    if (fn.search(/^.*\.pdf$/) >= 0) {
      return "application/pdf";
    }
    if (fn.search(/^.*\.ps$/) >= 0) {
      return "application/postscript";
    }
    if (fn.search(/^.*\.rtf$/) >= 0) {
      return "application/rtf";
    }
    if (fn.search(/^.*\.sit$/) >= 0) {
      return "application/stuffit";
    }
    if (fn.search(/^.*\.flv$/) >= 0) {
      return "video/x-flv";
    }
    if (fn.search(/^.*\.mdb$/) >= 0) {
      return "application/vnd.ms-access";
    }
    if (fn.search(/^.*\.xls$/) >= 0) {
      return "application/vnd.ms-excel";
    }
    if (fn.search(/^.*\.ppt$/) >= 0) {
      return "application/vnd.ms-powerpoint";
    }
    if (fn.search(/^.*\.pps$/) >= 0) {
      return "application/vnd.ms-powerpoint";
    }
    if (fn.search(/^.*\.pot$/) >= 0) {
      return "application/vnd.ms-powerpoint";
    }
    if (fn.search(/^.*\.xps$/) >= 0) {
      return "application/vnd.ms-xpsdocument";
    }
    if (fn.search(/^.*\.doc$/) >= 0) {
      return "application/msword";
    }
    if (fn.search(/^.*\.7z$/) >= 0) {
      return "application/x-7z-compressed";
    }
    if (fn.search(/^.*\.torrent$/) >= 0) {
      return "application/x-bittorrent";
    }
    if (fn.search(/^.*\.tar\.gz$/) >= 0) {
      return "application/x-compressed-tar";
    }
    if (fn.search(/^.*\.tgz$/) >= 0) {
      return "application/x-compressed-tar";
    }
    if (fn.search(/^.*\.ttf$/) >= 0) {
      return "application/x-font-ttf";
    }
    if (fn.search(/^.*\.gz$/) >= 0) {
      return "application/x-gzip";
    }
    if (fn.search(/^.*\.pdf\.gz$/) >= 0) {
      return "application/x-gzpdf";
    }
    if (fn.search(/^.*\.ps\.gz$/) >= 0) {
      return "application/x-gzpostscript";
    }
    if (fn.search(/^.*\.jar$/) >= 0) {
      return "application/x-java-archive";
    }
    if (fn.search(/^.*\.js$/) >= 0) {
      return "application/javascript";
    }
    if (fn.search(/^.*\.lzh$/) >= 0) {
      return "application/x-lha";
    }
    if (fn.search(/^.*\.mkv$/) >= 0) {
      return "video/x-matroska";
    }
    if (fn.search(/^.*\.exe$/) >= 0) {
      return "application/x-ms-dos-executable";
    }
    if (fn.search(/^.*\.ogg$/) >= 0) {
      return "application/ogg";
    }
    if (fn.search(/^.*\.ogx$/) >= 0) {
      return "application/ogg";
    }
    if (fn.search(/^.*\.oga$/) >= 0) {
      return "audio/ogg";
    }
    if (fn.search(/^.*\.ogv$/) >= 0) {
      return "video/ogg";
    }
    if (fn.search(/^.*\.ogg$/) >= 0) {
      return "audio/x-vorbis+ogg";
    }
    if (fn.search(/^.*\.ogg$/) >= 0) {
      return "audio/x-flac+ogg";
    }
    if (fn.search(/^.*\.ogg$/) >= 0) {
      return "audio/x-speex+ogg";
    }
    if (fn.search(/^.*\.spx$/) >= 0) {
      return "audio/x-speex";
    }
    if (fn.search(/^.*\.ogg$/) >= 0) {
      return "video/x-theora+ogg";
    }
    if (fn.search(/^.*\.ogm$/) >= 0) {
      return "video/x-ogm+ogg";
    }
    if (fn.search(/^.*\.qtl$/) >= 0) {
      return "application/x-quicktime-media-link";
    }
    if (fn.search(/^.*\.tar$/) >= 0) {
      return "application/x-tar";
    }
    if (fn.search(/^.*\.theme$/) >= 0) {
      return "application/x-theme";
    }
    if (fn.search(/^.*\.der$/) >= 0) {
      return "application/x-x509-ca-cert";
    }
    if (fn.search(/^.*\.cer$/) >= 0) {
      return "application/x-x509-ca-cert";
    }
    if (fn.search(/^.*\.crt$/) >= 0) {
      return "application/x-x509-ca-cert";
    }
    if (fn.search(/^.*\.cert$/) >= 0) {
      return "application/x-x509-ca-cert";
    }
    if (fn.search(/^.*\.pem$/) >= 0) {
      return "application/x-x509-ca-cert";
    }
    if (fn.search(/^.*\.xhtml$/) >= 0) {
      return "application/xhtml+xml";
    }
    if (fn.search(/^.*\.zip$/) >= 0) {
      return "application/zip";
    }
    if (fn.search(/^.*\.ac3$/) >= 0) {
      return "audio/ac3";
    }
    if (fn.search(/^.*\.aiff$/) >= 0) {
      return "audio/x-aiff";
    }
    if (fn.search(/^.*\.aif$/) >= 0) {
      return "audio/x-aiff";
    }
    if (fn.search(/^.*\.aifc$/) >= 0) {
      return "audio/x-aiff";
    }
    if (fn.search(/^.*\.flac$/) >= 0) {
      return "audio/x-flac";
    }
    if (fn.search(/^.*\.mid$/) >= 0) {
      return "audio/midi";
    }
    if (fn.search(/^.*\.midi$/) >= 0) {
      return "audio/midi";
    }
    if (fn.search(/^.*\.kar$/) >= 0) {
      return "audio/midi";
    }
    if (fn.search(/^.*\.m4a$/) >= 0) {
      return "audio/mp4";
    }
    if (fn.search(/^.*\.aac$/) >= 0) {
      return "audio/mp4";
    }
    if (fn.search(/^.*\.mp4$/) >= 0) {
      return "video/mp4";
    }
    if (fn.search(/^.*\.m4v$/) >= 0) {
      return "video/mp4";
    }
    if (fn.search(/^.*\.m4b$/) >= 0) {
      return "audio/x-m4b";
    }
    if (fn.search(/^.*\.3gp$/) >= 0) {
      return "video/3gpp";
    }
    if (fn.search(/^.*\.3gpp$/) >= 0) {
      return "video/3gpp";
    }
    if (fn.search(/^.*\.amr$/) >= 0) {
      return "video/3gpp";
    }
    if (fn.search(/^.*\.mp2$/) >= 0) {
      return "audio/mp2";
    }
    if (fn.search(/^.*\.mp3$/) >= 0) {
      return "audio/mpeg";
    }
    if (fn.search(/^.*\.mpga$/) >= 0) {
      return "audio/mpeg";
    }
    if (fn.search(/^.*\.m3u$/) >= 0) {
      return "audio/x-mpegurl";
    }
    if (fn.search(/^.*\.vlc$/) >= 0) {
      return "audio/x-mpegurl";
    }
    if (fn.search(/^.*\.asx$/) >= 0) {
      return "audio/x-ms-asx";
    }
    if (fn.search(/^.*\.wax$/) >= 0) {
      return "audio/x-ms-asx";
    }
    if (fn.search(/^.*\.wvx$/) >= 0) {
      return "audio/x-ms-asx";
    }
    if (fn.search(/^.*\.wmx$/) >= 0) {
      return "audio/x-ms-asx";
    }
    if (fn.search(/^.*\.psf$/) >= 0) {
      return "audio/x-psf";
    }
    if (fn.search(/^.*\.wma$/) >= 0) {
      return "audio/x-ms-wma";
    }
    if (fn.search(/^.*\.ra$/) >= 0) {
      return "audio/vnd.rn-realaudio";
    }
    if (fn.search(/^.*\.rax$/) >= 0) {
      return "audio/vnd.rn-realaudio";
    }
    if (fn.search(/^.*\.ram$/) >= 0) {
      return "application/ram";
    }
    if (fn.search(/^.*\.rv$/) >= 0) {
      return "video/vnd.rn-realvideo";
    }
    if (fn.search(/^.*\.rvx$/) >= 0) {
      return "video/vnd.rn-realvideo";
    }
    if (fn.search(/^.*\.wav$/) >= 0) {
      return "audio/x-wav";
    }
    if (fn.search(/^.*\.bmp$/) >= 0) {
      return "image/bmp";
    }
    if (fn.search(/^.*\.wbmp$/) >= 0) {
      return "image/vnd.wap.wbmp";
    }
    if (fn.search(/^.*\.gif$/) >= 0) {
      return "image/gif";
    }
    if (fn.search(/^.*\.jpeg$/) >= 0) {
      return "image/jpeg";
    }
    if (fn.search(/^.*\.jpg$/) >= 0) {
      return "image/jpeg";
    }
    if (fn.search(/^.*\.jpe$/) >= 0) {
      return "image/jpeg";
    }
    if (fn.search(/^.*\.png$/) >= 0) {
      return "image/png";
    }
    if (fn.search(/^.*\.rle$/) >= 0) {
      return "image/rle";
    }
    if (fn.search(/^.*\.svg$/) >= 0) {
      return "image/svg+xml";
    }
    if (fn.search(/^.*\.svgz$/) >= 0) {
      return "image/svg+xml-compressed";
    }
    if (fn.search(/^.*\.tif$/) >= 0) {
      return "image/tiff";
    }
    if (fn.search(/^.*\.tiff$/) >= 0) {
      return "image/tiff";
    }
    if (fn.search(/^.*\.eps$/) >= 0) {
      return "image/x-eps";
    }
    if (fn.search(/^.*\.ico$/) >= 0) {
      return "image/x-ico";
    }
    if (fn.search(/^.*\.psd$/) >= 0) {
      return "image/x-psd";
    }
    if (fn.search(/^.*\.vcs$/) >= 0) {
      return "text/calendar";
    }
    if (fn.search(/^.*\.ics$/) >= 0) {
      return "text/calendar";
    }
    if (fn.search(/^.*\.css$/) >= 0) {
      return "text/css";
    }
    if (fn.search(/^.*\.CSSL$/) >= 0) {
      return "text/css";
    }
    if (fn.search(/^.*\.rtx$/) >= 0) {
      return "text/richtext";
    }
    if (fn.search(/^.*\.rss$/) >= 0) {
      return "application/rss+xml";
    }
    if (fn.search(/^.*\.atom$/) >= 0) {
      return "application/atom+xml";
    }
    if (fn.search(/^.*\.opml$/) >= 0) {
      return "text/x-opml+xml";
    }
    if (fn.search(/^.*\.sgml$/) >= 0) {
      return "text/sgml";
    }
    if (fn.search(/^.*\.sgm$/) >= 0) {
      return "text/sgml";
    }
    if (fn.search(/^.*\.dtd$/) >= 0) {
      return "text/x-dtd";
    }
    if (fn.search(/^.*\.html$/) >= 0) {
      return "text/html";
    }
    if (fn.search(/^.*\.htm$/) >= 0) {
      return "text/html";
    }
    if (fn.search(/^.*\.log$/) >= 0) {
      return "text/x-log";
    }
    if (fn.search(/^README*$/) >= 0) {
      return "text/x-readme";
    }
    if (fn.search(/^.*\.uri$/) >= 0) {
      return "text/x-uri";
    }
    if (fn.search(/^.*\.url$/) >= 0) {
      return "text/x-uri";
    }
    if (fn.search(/^.*\.fo$/) >= 0) {
      return "text/x-xslfo";
    }
    if (fn.search(/^.*\.xslfo$/) >= 0) {
      return "text/x-xslfo";
    }
    if (fn.search(/^.*\.xml$/) >= 0) {
      return "application/xml";
    }
    if (fn.search(/^.*\.xsl$/) >= 0) {
      return "application/xml";
    }
    if (fn.search(/^.*\.xslt$/) >= 0) {
      return "application/xml";
    }
    if (fn.search(/^.*\.xbl$/) >= 0) {
      return "application/xml";
    }
    if (fn.search(/^.*\.mpeg$/) >= 0) {
      return "video/mpeg";
    }
    if (fn.search(/^.*\.mpg$/) >= 0) {
      return "video/mpeg";
    }
    if (fn.search(/^.*\.mp2$/) >= 0) {
      return "video/mpeg";
    }
    if (fn.search(/^.*\.mpe$/) >= 0) {
      return "video/mpeg";
    }
    if (fn.search(/^.*\.vob$/) >= 0) {
      return "video/mpeg";
    }
    if (fn.search(/^.*\.m2t$/) >= 0) {
      return "video/mpeg";
    }
    if (fn.search(/^.*\.qt$/) >= 0) {
      return "video/quicktime";
    }
    if (fn.search(/^.*\.mov$/) >= 0) {
      return "video/quicktime";
    }
    if (fn.search(/^.*\.moov$/) >= 0) {
      return "video/quicktime";
    }
    if (fn.search(/^.*\.qtvr$/) >= 0) {
      return "video/quicktime";
    }
    if (fn.search(/^.*\.qtif$/) >= 0) {
      return "image/x-quicktime";
    }
    if (fn.search(/^.*\.qif$/) >= 0) {
      return "image/x-quicktime";
    }
    if (fn.search(/^.*\.viv$/) >= 0) {
      return "video/vivo";
    }
    if (fn.search(/^.*\.vivo$/) >= 0) {
      return "video/vivo";
    }
    if (fn.search(/^.*\.anim[1-9j]$/) >= 0) {
      return "video/x-anim";
    }
    if (fn.search(/^.*\.fli$/) >= 0) {
      return "video/x-flic";
    }
    if (fn.search(/^.*\.flc$/) >= 0) {
      return "video/x-flic";
    }
    if (fn.search(/^.*\.hwp$/) >= 0) {
      return "application/x-hwp";
    }
    if (fn.search(/^.*\.hwt$/) >= 0) {
      return "application/x-hwt";
    }
    if (fn.search(/^.*\.mng$/) >= 0) {
      return "video/x-mng";
    }
    if (fn.search(/^.*\.asf$/) >= 0) {
      return "video/x-ms-asf";
    }
    if (fn.search(/^.*\.nsc$/) >= 0) {
      return "application/x-netshow-channel";
    }
    if (fn.search(/^.*\.wmv$/) >= 0) {
      return "video/x-ms-wmv";
    }
    if (fn.search(/^.*\.avi$/) >= 0) {
      return "video/x-msvideo";
    }
    if (fn.search(/^.*\.divx$/) >= 0) {
      return "video/x-msvideo";
    }
    return "binary/octet-stream";
  };
})();

export default AgilityUGCAPI;
