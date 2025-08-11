// Simple bilingual (English <-> Bangla) toggle for static site
// Strategy:
// - Elements annotated with data-i18n="key" will be translated.
// - English text is already in DOM (source of truth for EN) and also stored below.
// - Bangla dictionary provides BN equivalents.
// - Language preference stored in localStorage key: vaatco_lang (values: en | bn)
// - Toggle button #languageToggle updates all annotated nodes.
// - Fallback: if key missing in BN, keep English.

(function(){
  const STORAGE_KEY = 'vaatco_lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en','bn'];

  const dict = {
    'hero.title1': 'ভ্যাটকো বাংলাদেশ লিমিটেড: ভবিষ্যতের তরঙ্গ',
    'hero.subtitle1': 'ভ্যাটকো বাংলাদেশ লিমিটেড মৎস্য, গবাদি ও পোল্ট্রি ঔষধ এবং ফিড সম্পূরক পণ্যে বিশেষায়িত অ্যাকুয়াকালচার/এগ্রো সেক্টরে কাজ করে',
    'hero.title2': 'টেকসই অ্যাকুয়াকালচার সমাধান',
    'hero.subtitle2': 'উচ্চমানের প্রোবায়োটিক, প্রয়োজনীয় সম্পূরক এবং উন্নত পানি ব্যবস্থাপনা সমাধানের মাধ্যমে কৃষকদের ক্ষমতায়ন',
    'hero.title3': 'মাছের স্বাস্থ্য ও পানি গুণমানে উৎকর্ষ',
    'hero.subtitle3': 'মাছের স্বাস্থ্য উন্নত করতে এবং পুকুরের পরিবেশ সুস্থ রাখতে আমাদের বিস্তৃত পণ্য পরিসর আবিষ্কার করুন',
    'actions.exploreProducts': 'পণ্য দেখুন',
    'actions.contactUs': 'যোগাযোগ করুন',
    'actions.learnMore': 'আরও জানুন',
    'actions.findDealers': 'ডিলার খুঁজুন',
    'actions.viewProducts': 'পণ্য দেখুন',
    'actions.viewGallery': 'গ্যালারি দেখুন',
    'sections.offer': 'আমরা কী অফার করি',
    'offer.wideSelection.title': 'উচ্চমানের পণ্যের বিস্তৃত নির্বাচন',
    'offer.wideSelection.text': 'অ্যাকুয়াকালচার ও ভেটেরিনারি পণ্যের বিস্তৃত সংগ্রহ প্রদান',
    'offer.trusted.title': 'বিশ্বস্ত ও নির্ভরযোগ্য',
    'offer.trusted.text': 'আপনার অ্যাকুয়াকালচার যাত্রার বিশ্বস্ত অংশীদার হতে',
    'offer.focus.title': 'কাস্টমার ফোকাস',
    'offer.focus.text': 'কাস্টমার ফোকাস আমাদের সব কাজের কেন্দ্রবিন্দু',
    'offer.service.title': 'কাস্টমার সার্ভিস অগ্রাধিকার',
    'offer.service.text': 'কাস্টমার সার্ভিস অগ্রাধিকার আপনার সন্তুষ্টি নিশ্চিত করে',
    'product.header.title': 'আমাদের পণ্যের তালিকা',
    'product.header.subtitle': 'আমাদের উচ্চমানের ফার্মাসিউটিক্যাল এবং ফাইন কেমিক্যালস আবিষ্কার করুন',
    'table.serial': 'ক্রম',
    'table.productName': 'পণ্যের নাম',
    'table.type': 'ধরন',
    'table.genericName': 'জেনেরিক নাম',
    'table.packSize': 'প্যাক সাইজ',
    'table.packingType': 'প্যাকিং টাইপ',
    'product.info.qualityTitle': 'গুণগত মান নিশ্চিত',
    'product.info.qualityText': 'সব পণ্য আন্তর্জাতিক মান পূরণ করে',
    'product.info.deliveryTitle': 'দ্রুত ডেলিভারি',
    'product.info.deliveryText': 'বাংলাদেশের সকল এলাকায় সময়মত ডেলিভারি',
    'product.info.supportTitle': 'এক্সপার্ট সাপোর্ট',
    'product.info.supportText': 'পেশাদার টেকনিক্যাল সাপোর্ট ও পরামর্শ',
  'product.info.contactButton': 'বিশেষ প্রয়োজনীয়তার জন্য যোগাযোগ করুন',
  // Navigation
  'nav.home':'হোম','nav.about':'আমাদের সম্পর্কে','nav.products':'পণ্য','nav.productsOverview':'ওভারভিউ','nav.productList':'পণ্যের তালিকা','nav.services':'সেবা','nav.team':'টিম','nav.dealers':'ডিলার','nav.contact':'যোগাযোগ',
  // About section
  'about.since':'২০২৪ সাল থেকে','about.title':'ভ্যাটকো: টেকসই সমাধানে পথিকৃৎ','about.lead':'ভ্যাটকো বাংলাদেশ লিমিটেড উচ্চমানের প্রোবায়োটিক, গুরুত্বপূর্ণ সম্পূরক ও উন্নত পানি ব্যবস্থাপনা সমাধান প্রদান করে অগ্রগামী অবস্থানে আছে।','about.description':'আমাদের অঙ্গীকার হলো অ্যাকুয়াকালচার ও কৃষিতে টেকসই প্রবৃদ্ধি নিশ্চিত করা, কৃষকদের কর্মক্ষম ও নির্ভরযোগ্য পণ্যের মাধ্যমে ক্ষমতায়ন করা।',
  'about.features.quality.title':'গুণগত মান নিশ্চিত','about.features.quality.text':'কঠোর পরীক্ষার মাধ্যমে আইএসও অনুমোদিত পণ্য','about.features.eco.title':'ইকো-ফ্রেন্ডলি','about.features.eco.text':'পরিবেশ সুরক্ষায় টেকসই সমাধান','about.features.support.title':'এক্সপার্ট সাপোর্ট','about.features.support.text':'২৪/৭ বিশেষজ্ঞদের কারিগরি সহায়তা',
  // Products overview section
  'products.sectionTitle':'আমাদের মূল পণ্যের বিভাগসমূহ','products.cat1.title':'অ্যাকুয়াকালচার পণ্য','products.cat1.text':'মাছের স্বাস্থ্য, দ্রুত বৃদ্ধি ও পরিষ্কার পুকুর পরিবেশ বজায় রাখতে আমাদের পণ্যের পরিসর আবিষ্কার করুন।','products.cat2.title':'ভেটেরিনারি পণ্য','products.cat2.text':'গবাদি পশুর স্বাস্থ্য ও উৎপাদনশীলতা নিশ্চিত করতে আমাদের ভেটেরিনারি ঔষধ ও সম্পূরক।','products.cat3.title':'ওয়াটার ট্রিটমেন্ট ও পুকুর পরিচর্যা','products.cat3.text':'পানির গুণমান উন্নত রাখতে আমাদের উন্নত সমাধান যা রোগ প্রতিরোধ ও সুস্থ পরিবেশ নিশ্চিত করে।','products.viewListBtn':'আমাদের পণ্যের তালিকা দেখুন','products.viewListNote':'বিস্তারিত স্পেসিফিকেশন ও সার্চ সুবিধাসহ পূর্ণ ক্যাটালগ দেখুন',
  // Why choose
  'why.title':'কেন ভ্যাটকো? আপনার সাফল্যে আমাদের অঙ্গীকার','why.card1.title':'উচ্চমানের পণ্য','why.card1.text':'আমরা কঠোর গুণমান নিয়ন্ত্রণ মানি যাতে প্রতিটি পণ্য কার্যকর থাকে।','why.card2.title':'ক্ষেত্র-পরীক্ষিত সমাধান','why.card2.text':'বাস্তবিক চাষাবাদে পরীক্ষিত পণ্য যা নির্ভরযোগ্যতা নিশ্চিত করে।','why.card3.title':'কৃষক ও ডিলার সাপোর্ট','why.card3.text':'কৃষক ও বিতরণ অংশীদারদের জন্য অনন্য সহায়তা।','why.card4.title':'সাশ্রয়ী ও কার্যকর','why.card4.text':'উচ্চ ফলাফল সহ সাশ্রয়ী সমাধান যা বিনিয়োগের রিটার্ন বাড়ায়।',
  // Services
  'services.title':'আমাদের সেবা','services.lead':'টেকসই অ্যাকুয়াকালচার ও কৃষি সহায়তায় ভ্যাটকোর বিস্তৃত সেবা।','services.card1.title':'অ্যাকুয়াকালচার পরামর্শ','services.card1.text':'মাছ চাষ, পুকুর ব্যবস্থাপনা ও পানি গুণমান অপ্টিমাইজেশনে বিশেষজ্ঞ পরামর্শ।','services.card2.title':'কৃষি সহায়তা','services.card2.text':'গবাদি ও পোল্ট্রি খাতে বিশেষায়িত ঔষধ ও সম্পূরক সমাধান।','services.card3.title':'পানি গুণমান পরীক্ষা','services.card3.text':'জলজ প্রাণীর জন্য উপযুক্ত পরিবেশ নিশ্চিত করতে পেশাদার পানি বিশ্লেষণ।','services.card4.title':'প্রশিক্ষণ প্রোগ্রাম','services.card4.text':'আধুনিক চাষাবাদ ও অ্যাকুয়াকালচারের শ্রেষ্ঠ চর্চার উপর কর্মশালা।','services.card5.title':'পণ্য বিতরণ','services.card5.text':'বাংলাদেশ জুড়ে সময়মত মানসম্পন্ন পণ্য ডেলিভারি।','services.card6.title':'কারিগরি সহযোগিতা','services.card6.text':'২৪/৭ টেকনিক্যাল ও কাস্টমার সাপোর্ট।','services.getBtn':'আমাদের সেবা নিন','services.contactBtn':'পরামর্শের জন্য যোগাযোগ',
  // Management
  'management.title':'ম্যানেজমেন্ট টিম','management.subtitle':'আমাদের অভিজ্ঞ নেতৃত্ব দলকে জানুন যারা দেশের অ্যাকুয়াকালচার ও কৃষি সমাধানে উৎকর্ষ আনে।','management.headOps':'হেড অব অপারেশনস','management.gmOps':'জেনারেল ম্যানেজার (অপারেশন)','management.dgmTech':'ডেপুটি জেনারেল ম্যানেজার (টেকনিক্যাল)',
  // Gallery
  'gallery.title':'গ্যালারি','gallery.subtitle':'আমাদের পণ্য ও অর্জনের চিত্র সংগ্রহ দেখুন।',
  // Blog
  'blog.title':'সর্বশেষ অন্তর্দৃষ্টি: ভ্যাটকো ব্লগ','blog.lead':'অ্যাকুয়াকালচার ও এগ্রো ভিত্তিক ঔষধে সর্বশেষ প্রবণতা ও শ্রেষ্ঠ চর্চায় আপডেট থাকুন।','blog.post1.title':'অ্যাকুয়াকালচারে জিওলাইটের ৫টি উপকারিতা','blog.post1.text':'জিওলাইট কিভাবে পানি গুণমান রক্ষা, টক্সিন শোষণ এবং মাছ বৃদ্ধিতে সহায়তা করে জানুন।','blog.post2.title':'ইউক্কা কিভাবে পুকুরের পানি গুণমান উন্নত করে','blog.post2.text':'অ্যামোনিয়া কমাতে ও দুর্গন্ধ হ্রাসে ইউক্কা এক্সট্রাক্টের প্রাকৃতিক শক্তি জানুন।','blog.readMore':'আরও আর্টিকেল পড়ুন',
  // Dealers
  'dealers.title':'আমাদের ডিলার খুঁজুন: আপনার স্থানীয় ভ্যাটকো অংশীদার','dealers.lead':'নিকটস্থ অনুমোদিত ডিলার সহজেই খুঁজুন। আমাদের নেটওয়ার্ক সারা বাংলাদেশে মানসম্পন্ন পণ্য সরবরাহ নিশ্চিত করে।','dealers.table.district':'জেলা','dealers.table.dealer':'ডিলারের নাম','dealers.table.contact':'যোগাযোগ','dealers.become':'ডিস্ট্রিবিউটর হোন',
  // Contact
  'contact.title':'যোগাযোগ করুন: ভ্যাটকোর সাথে যোগাযোগ','contact.subtitle':'প্রশ্ন বা সহায়তা দরকার? আমাদের টিম প্রস্তুত আছেন।','contact.form.title':'আমাদের বার্তা পাঠান','contact.form.lead':'নীচের ফর্ম পূরণ করুন, আমরা দ্রুত উত্তর দেব। তাৎক্ষণিক সহায়তার জন্য কল বা হোয়াটসঅ্যাপ ব্যবহার করুন।','contact.form.fullNameLabel':'পূর্ণ নাম','contact.form.fullNamePh':'আপনার পূর্ণ নাম লিখুন','contact.form.emailLabel':'ইমেইল ঠিকানা','contact.form.emailPh':'আপনার ইমেইল লিখুন','contact.form.phoneLabel':'ফোন নম্বর','contact.form.phonePh':'আপনার ফোন নম্বর লিখুন','contact.form.subjectLabel':'বিষয়','contact.form.subjectPh':'কিসের সম্পর্কে?','contact.form.messageLabel':'বার্তা','contact.form.messagePh':'আমরা কিভাবে সাহায্য করতে পারি...','contact.form.sendBtn':'বার্তা পাঠান',
  'contact.info.title':'যোগাযোগের তথ্য','contact.info.addressLabel':'অফিসের ঠিকানা','contact.info.callLabel':'এখনই কল করুন','contact.info.emailLabel':'ইমেইল','contact.info.callBtn':'কল করুন','contact.info.whatsappBtn':'হোয়াটসঅ্যাপে পাঠান',
  // Footer
  'footer.tagline':'ভ্যাটকো বাংলাদেশ লিমিটেড - ভবিষ্যতের তরঙ্গ','footer.love':'টেকসই অ্যাকুয়াকালচারের জন্য ভালোবাসা দিয়ে তৈরি'
  };

  // Capture English originals once for keys present in DOM (so if text changes later it remains correct)
  const enCache = {};

  function collectOriginals(){
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(!enCache[key]) enCache[key] = el.innerText.trim();
    });
  }

  function applyLanguage(lang){
    if(!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    document.documentElement.setAttribute('lang', lang === 'bn' ? 'bn':'en');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(lang === 'bn') {
        const bn = dict[key];
        if(bn) el.innerText = bn; else if(enCache[key]) el.innerText = enCache[key];
      } else {
        if(enCache[key]) el.innerText = enCache[key];
      }
    });
    // Placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      if(lang==='bn'){ el.setAttribute('placeholder', dict[key] || el.getAttribute('placeholder')); }
      else { el.setAttribute('placeholder', enCache[key] || el.getAttribute('placeholder')); }
    });
    updateToggleLabel(lang);
  }

  function updateToggleLabel(lang){
    const btn = document.getElementById('languageToggle');
    if(btn){
      const span = btn.querySelector('[data-lang-label]');
      if(span){ span.textContent = lang === 'bn' ? 'EN' : 'BN'; }
      btn.setAttribute('aria-pressed', lang === 'bn');
    }
  }

  function toggleLanguage(){
    const current = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    const next = current === 'en' ? 'bn' : 'en';
    localStorage.setItem(STORAGE_KEY, next);
    applyLanguage(next);
  }

  function init(){
    collectOriginals();
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    applyLanguage(saved);
    const btn = document.getElementById('languageToggle');
    if(btn && !btn.dataset.bound){
      btn.addEventListener('click', toggleLanguage);
      btn.dataset.bound = '1';
    }
    // Mutation observer to auto-translate dynamically inserted nodes with data-i18n
    const mo = new MutationObserver(muts=>{
      let needs=false;
      muts.forEach(m=>{
        m.addedNodes.forEach(node=>{
          if(node.nodeType===1){
            if(node.hasAttribute && node.hasAttribute('data-i18n')){needs=true;}
            node.querySelectorAll && node.querySelectorAll('[data-i18n]').forEach(()=>needs=true);
          }
        });
      });
      if(needs){ collectOriginals(); applyLanguage(localStorage.getItem(STORAGE_KEY)||DEFAULT_LANG); }
    });
    mo.observe(document.documentElement,{subtree:true, childList:true});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
