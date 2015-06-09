package com.cloudkarting;

import com.google.api.server.spi.config.Api;

import java.util.List;
import java.util.Date;

import javax.inject.Named;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.ObjectifyService;

/**
 * Defines v1 of a driver API.
 */
@Api(
    name = "driver",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
    audiences = {Constants.ANDROID_AUDIENCE}
)
@Entity
public class Driver {
    @Id public Long id;
    @Index public String name;
    @Index public Date creationDate;
    public Date updateDate;

    public Driver() {
        creationDate = new Date();
        updateDate = creationDate;
    }

    public Driver(String name) {
        this();
        this.name = name;
    }

//    public String getName() {
//        return name;
//    }
//
//    public void setUpdateDate(Date updateDate) {
//        this.updateDate = updateDate;
//    }

    public Driver createDriver(@Named("name") String name) {

        ObjectifyService.ofy().save().entity(new Driver(name)).now();
        return getDriver(name);
    }

    public Driver getDriver(@Named("name") String name) {
        return ObjectifyService.ofy().load().type(Driver.class).filter("name", name).first().now();
    }

    public Driver updateDriver(@Named("name") String name) {
        Driver p = getDriver(name);
        p.updateDate = new Date();

        ObjectifyService.ofy().save().entity(p).now();
        return getDriver(name);
    }

    public Driver deleteDriver(@Named("name") String name) {
        Driver p = getDriver(name);

        ObjectifyService.ofy().delete().entity(p).now();
        return p;
    }

    public List<Driver> listDrivers() {
        return ObjectifyService.ofy()
                .load()
                .type(Driver.class)
                        //.ancestor(Objects)
                        // .order("-creationDate")
                        // .limit(5)
                .list();
    }
}