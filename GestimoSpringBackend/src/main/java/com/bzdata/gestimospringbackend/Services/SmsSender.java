package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.Models.SmsRequest;

public interface SmsSender {

    void sendSms(SmsRequest smsRequest);
}
